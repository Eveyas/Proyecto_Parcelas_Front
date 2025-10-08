const express = require('express');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4001;

// Configuración de sensores
const SENSOR_TYPES = ['temperature', 'humidity', 'rain', 'solar_radiation'];

// Genera una sola lectura de sensor (con ruido)
function generateReading(sensorId) {
  const timestamp = Date.now();
  const temperature = +(20 + Math.sin(timestamp / 60000 + sensorId) * 6 + (Math.random() - 0.5) * 2).toFixed(2);
  const humidity = +(50 + Math.cos(timestamp / 45000 + sensorId) * 10 + (Math.random() - 0.5) * 4).toFixed(2);
  const rain = +(Math.max(0, Math.sin(timestamp / 30000 + sensorId) * 10 + (Math.random() - 0.5) * 5)).toFixed(2);
  const solar_radiation = +(Math.max(0, 400 + Math.sin(timestamp / 50000 + sensorId) * 300 + (Math.random() - 0.5) * 100)).toFixed(2);

  return {
    id: uuidv4(),
    sensorId: `sensor-${sensorId}`,
    timestamp,
    temperature,
    humidity,
    rain,
    solar_radiation
  };
}

// Generador asíncrono que emite lecturas para N sensores en intervalos aleatorios
async function* sensorGenerator({ sensors = 10, maxIntervalMs = 5000 } = {}) {
  const nextDelays = Array.from({ length: sensors }, () => Math.floor(Math.random() * maxIntervalMs) + 1000);
  const lastEmit = Array.from({ length: sensors }, () => Date.now());

  while (true) {
    const now = Date.now();
    for (let i = 0; i < sensors; i++) {
      if (now - lastEmit[i] >= nextDelays[i]) {
        yield generateReading(i);
        lastEmit[i] = now;
  nextDelays[i] = Math.floor(Math.random() * maxIntervalMs) + 1000; // 1 - maxInterval
      }
    }
  // pequeña pausa para evitar un bucle ocupando CPU (busy loop)
    await new Promise((res) => setTimeout(res, 100));
  }
}

// Suscriptores en memoria para SSE
const sseClients = new Set();

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'sensor-service' }));

// Endpoint de Server-Sent Events (SSE) para streaming
app.get('/stream', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders && res.flushHeaders();

  const client = { res };
  sseClients.add(client);

  req.on('close', () => {
    sseClients.delete(client);
  });
});

// Servidor WebSocket para push
const server = app.listen(port, () => {
  console.log(`Sensor service listening on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WS client connected');
  ws.on('close', () => console.log('WS client disconnected'));
});

// Inicia el generador principal y retransmite lecturas a los clientes conectados
(async () => {
  const gen = sensorGenerator({ sensors: 50, maxIntervalMs: 5000 });
  for await (const reading of gen) {
    const payload = JSON.stringify(reading);

  // Enviar a clientes SSE
    for (const c of sseClients) {
      try {
        c.res.write(`data: ${payload}\n\n`);
      } catch (err) {
        sseClients.delete(c);
      }
    }

  // Enviar a clientes WebSocket
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(payload);
      }
    });
  }
})();

// Endpoint rápido para generar N registros inmediatamente (prueba de estrés)
app.get('/generate', async (req, res) => {
  const n = Math.min(200000, parseInt(req.query.n || '10000', 10));
  const sensors = parseInt(req.query.sensors || '100', 10);
  const out = [];
  const start = Date.now();

  for (let i = 0; i < n; i++) {
    const sensorId = i % sensors;
    out.push(generateReading(sensorId));
  }

  const durationMs = Date.now() - start;
  res.json({ generated: out.length, durationMs });
});

// Modo de auto-prueba: ejecutar una pequeña prueba de estrés cuando se llame con --selftest
if (process.argv.includes('--selftest')) {
  (async () => {
    console.log('Running self test: generating 10000 records');
    const resp = await new Promise((resolve) => {
      const http = require('http');
      http.get(`http://localhost:${port}/generate?n=10000&sensors=200`, (r) => {
        let data = '';
        r.on('data', (c) => (data += c));
        r.on('end', () => resolve(JSON.parse(data)));
      }).on('error', (e) => resolve({ error: e.message }));
    });
    console.log('Selftest result:', resp);
    process.exit(0);
  })();
}

// Cierre ordenado (graceful shutdown)
process.on('SIGINT', () => {
  console.log('Shutting down sensor service');
  server.close(() => process.exit(0));
});
