const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Service Registry — configured via environment for cloud deployment
const ROUTING_ENGINE_URL = process.env.ROUTING_ENGINE_URL || 'http://localhost:8081';
const QUEUE_INTELLIGENCE_URL = process.env.QUEUE_INTELLIGENCE_URL || 'http://localhost:5000';
const TELEMETRY_INGESTION_URL = process.env.TELEMETRY_INGESTION_URL || 'http://localhost:8080';

// Healthcheck
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'omniflow-api-gateway', 
        timestamp: new Date(),
        upstreams: {
            routing: ROUTING_ENGINE_URL,
            queue: QUEUE_INTELLIGENCE_URL,
            telemetry: TELEMETRY_INGESTION_URL
        }
    });
});

// 1. Proxy Routing Requests
app.use('/api/v1/routing', createProxyMiddleware({
    target: ROUTING_ENGINE_URL,
    changeOrigin: true,
}));

// 2. Proxy Queue Intelligence Requests
app.use('/api/v1/predict/queue', createProxyMiddleware({
    target: QUEUE_INTELLIGENCE_URL,
    changeOrigin: true,
}));

// 3. Consolidated Venue State
app.get('/api/v1/venue/state', async (req, res) => {
    try {
        const response = await fetch(`${ROUTING_ENGINE_URL}/api/v1/venue/state`);
        const data = await response.json();
        
        // Enrich data with gateway-level metadata
        data.gateway_status = 'OPERATIONAL';
        
        res.json(data);
    } catch (err) {
        console.error("Failed to fetch venue state from routing-engine, falling back to mock", err);
        // Fallback mock data if services are down
        res.json({
            event: "Championship Match (Offline Mode)",
            zones: [
                { id: 'z1', name: 'South Gate', density: 50, status: 'NORMAL' }
            ],
            global_metrics: {
                active_attendees: 0,
                pings_per_sec: 0,
                avg_wait_times: { restrooms: 0, merch: 0, entry: 0 }
            }
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Gateway operational on port ${PORT}`);
    console.log(`- Proxying Routing to: ${ROUTING_ENGINE_URL}`);
    console.log(`- Proxying Queue Intel to: ${QUEUE_INTELLIGENCE_URL}`);
    console.log(`- Proxying Telemetry to: ${TELEMETRY_INGESTION_URL}`);
});
