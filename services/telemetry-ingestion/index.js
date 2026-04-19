const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const fastifyWebsocket = require('@fastify/websocket');

fastify.register(cors, { origin: true });
// In a real environment, we would connect to Kafta via kafkajs
// const { Kafka } = require('kafkajs');
// const kafka = new Kafka({ clientId: 'ingest', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
// const producer = kafka.producer();

// Mock producer for local development
const mockProducer = {
  connect: async () => console.log('[Mock Kafka] Producer connected'),
  send: async (payload) => console.log(`[Mock Kafka] Sent ${payload.messages.length} messages to topic: ${payload.topic}`)
};

fastify.register(fastifyWebsocket);

fastify.register(async function (app) {
  // Using WebSocket to maintain sub-200ms latency pipelines over continuous connection
  app.get('/ws/telemetry', { websocket: true }, (connection, req) => {
    
    connection.socket.on('message', async (message) => {
        // Fast buffer copy instead of JSON parse for raw throughput
        // Assume binary Float32Array: [id_hash, lat, lng, flag]
        // But for mock display we'll assume JSON string:
        try {
            const data = JSON.parse(message.toString());
            fastify.log.info({ dev: data.device_id }, 'Received telemetry');
            
            // Push directly to Kafka memory buffer for zero-blocking
            await mockProducer.send({
                topic: 'raw_telemetry',
                messages: [{ value: JSON.stringify(data) }]
            });
            
        } catch (err) {
            fastify.log.error('Invalid payload format');
        }
    });

    connection.socket.on('close', () => {
        fastify.log.info('Client disconnected');
    });
  });
});

async function start() {
  try {
    await mockProducer.connect();
    // Use 0.0.0.0 to bind for Docker containers (ECS Fargate)
    await fastify.listen({ port: process.env.PORT || 8080, host: '0.0.0.0' });
    console.log(`Telemetry Ingestion active on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
