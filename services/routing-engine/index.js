const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const createGraph = require('ngraph.graph');
const path = require('ngraph.path');

fastify.register(cors, {
  origin: true // Allow all origins for the demonstration
});

// 1. Initialize static NavMesh Graph
// In production, this is built from GeoJSON imported from PostgreSQL (ST_AsGeoJSON)
const venueGraph = createGraph();

// MOCK data: A simple 4-node diamond graph
// N1(Gate) -> N2(Concourse A) -> N4(Seats)
// N1(Gate) -> N3(Concourse B) -> N4(Seats)
venueGraph.addNode('N1', { x: 0, y: 0, zoneId: 'ZN-GATE' });
venueGraph.addNode('N2', { x: 10, y: 10, zoneId: 'ZN-CONCOURSE-A' });
venueGraph.addNode('N3', { x: 10, y: -10, zoneId: 'ZN-CONCOURSE-B' });
venueGraph.addNode('N4', { x: 20, y: 0, zoneId: 'ZN-SEATS' });

// Add edges with baseline traversal cost (seconds)
venueGraph.addLink('N1', 'N2', { baseCost: 120 });
venueGraph.addLink('N1', 'N3', { baseCost: 130 });
venueGraph.addLink('N2', 'N4', { baseCost: 45 });
venueGraph.addLink('N3', 'N4', { baseCost: 40 });

// Global Mock State: In production, retrieved from Redis cache built by Flink
let currentZoneDensities = {
    'ZN-CONCOURSE-A': 0.92, // 92% dense (CRITICAL)
    'ZN-CONCOURSE-B': 0.30  // 30% dense (CLEAR)
};

// 2. Dynamic A* Pathfinding Logic
fastify.get('/api/v1/routing', async (request, reply) => {
    const { startNode, destNode } = request.query;
    
    // Safety check
    if (!venueGraph.getNode(startNode) || !venueGraph.getNode(destNode)) {
        return reply.status(400).send({ error: "Invalid nodes" });
    }

    // Graph weight mutator: A* pathfinder
    const aStarPathfinder = path.aStar(venueGraph, {
        // Distance heuristic is standard euclidean
        heuristic(pos1, pos2) {
            const dx = pos1.x - pos2.x;
            const dy = pos1.y - pos2.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        // Edge weight mutator based on live crowds! (CRITICAL LOGIC)
        distance(fromNode, toNode, link) {
            const targetZoneId = toNode.data.zoneId;
            const liveDensity = currentZoneDensities[targetZoneId] || 0;
            
            // Equation: Cost = baseCost * (1 + e^(Penalty))
            if (liveDensity > 0.85) {
                // Exponential penalty for congested zones
                // forces the algorithm to find adjacent clear hallways
                return link.data.baseCost * Math.exp(liveDensity * 8); // Severe multiplier
            }
            return link.data.baseCost; // Uncongested
        }
    });

    // Execute pathfinding
    const route = aStarPathfinder.find(startNode, destNode);
    
    // Map response
    // ngraph returns backwards from destination -> start
    const sequence = route.reverse().map(n => ({
        id: n.id,
        zone: n.data.zoneId
    }));

    return {
        event: "Championship Match",
        optimalRoute: sequence,
        metadata: {
            avoidsCongestion: currentZoneDensities['ZN-CONCOURSE-A'] > 0.85 ? true : false,
            latency_ms: "N/A" 
        }
    };
});

// Mock Venue State for Dashboard
fastify.get('/api/v1/venue/state', async (request, reply) => {
    return {
        event: "Championship Match",
        zones: [
            { id: 'z1', name: 'South Gate', density: 85 + Math.floor(Math.random() * 10), status: 'CRITICAL' },
            { id: 'z2', name: 'North Gate', density: 30 + Math.floor(Math.random() * 15), status: 'NORMAL' },
            { id: 'z3', name: 'Concourse A (Food)', density: 60 + Math.floor(Math.random() * 10), status: 'WARNING' },
            { id: 'z4', name: 'VIP Suite Level', density: 10 + Math.floor(Math.random() * 5), status: 'NORMAL' }
        ],
        global_metrics: {
            active_attendees: 84000,
            pings_per_sec: 14200 + Math.floor(Math.random() * 1000),
            avg_wait_times: {
                restrooms: 18, 
                merch: 8,
                entry: Math.floor(Math.random() * 300)
            }
        }
    };
});

async function start() {
    try {
        await fastify.listen({ port: process.env.PORT || 8081, host: '0.0.0.0' });
        console.log(`Routing Engine active on port ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
