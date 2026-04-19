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
        event: "ICC World Cup Final - Narendra Modi Stadium",
        optimalRoute: sequence,
        metadata: {
            avoidsCongestion: currentZoneDensities['ZN-CONCOURSE-A'] > 0.85 ? true : false,
            latency_ms: "N/A" 
        }
    };
});

// 3. Stateful Time-Series Simulation Logic (IST Synchronized)
function getSimulatedVenueState() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = istTime.getHours();
    
    // Simulation logic based on match-day cycle
    // 16:00 - 18:00: Peak Inbound (Gates busy)
    // 19:30 - 22:30: Peak Match (Seats full, concourses active)
    // 23:00+: Outbound (Exit gates busy)
    
    let baseAttendees = 0;
    let basePings = 0;
    let multipliers = { z1: 1, z2: 1, z3: 1, z4: 1 };

    if (hour >= 15 && hour < 19) {
        // Pre-match arrival spike
        baseAttendees = 45000 + (hour - 15) * 15000;
        basePings = 8000 + Math.random() * 2000;
        multipliers.z1 = 1.5; // Gate 1 busy
        multipliers.z2 = 1.6; // Gate 2 busy
    } else if (hour >= 19 && hour < 23) {
        // Live match
        baseAttendees = 120000 + Math.random() * 5000;
        basePings = 15000 + Math.random() * 3000;
        multipliers.z3 = 1.4; // Concourse active
    } else {
        // Late night / Early morning
        baseAttendees = 500 + Math.random() * 200;
        basePings = 100 + Math.random() * 50;
    }

    const randomVar = () => Math.random() * 10;

    return {
        event: "ICC World Cup Final - Stadium Intel",
        venue_id: "AMD-NMS-01",
        timestamp: istTime.toISOString(),
        zones: [
            { id: 'z1', name: 'Gate 1 (Corporate)', density: Math.min(100, Math.floor((45 * multipliers.z1) + randomVar())), status: multipliers.z1 > 1.4 ? 'CRITICAL' : 'NORMAL' },
            { id: 'z2', name: 'Gate 2 (General)', density: Math.min(100, Math.floor((35 * multipliers.z2) + randomVar())), status: multipliers.z2 > 1.4 ? 'CRITICAL' : 'NORMAL' },
            { id: 'z3', name: 'Reliance Concourse', density: Math.min(100, Math.floor((55 * multipliers.z3) + randomVar())), status: multipliers.z3 > 1.3 ? 'WARNING' : 'NORMAL' },
            { id: 'z4', name: 'Presidential Suite', density: Math.min(100, Math.floor((15 * multipliers.z4) + randomVar())), status: 'NORMAL' }
        ],
        global_metrics: {
            active_attendees: Math.floor(baseAttendees),
            pings_per_sec: Math.floor(basePings),
            decibel_level: 65 + (baseAttendees / 1000) * 0.3 + (Math.random() * 5),
            avg_wait_times: {
                restrooms: Math.floor(5 + (baseAttendees / 10000)), 
                merch: Math.floor(2 + (baseAttendees / 12000)),
                entry: Math.floor(Math.random() * 300)
            }
        }
    };
}

fastify.get('/api/v1/venue/state', async (request, reply) => {
    return getSimulatedVenueState();
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
