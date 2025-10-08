# Servicio B — Sensores emulados

Microservicio Node.js que genera lecturas de sensores virtuales (temperatura, humedad, lluvia, radiación solar). Ofrece canales de streaming via SSE y WebSocket, y un endpoint de generación rápida para pruebas de estrés.

Endpoints:
- GET /health -> estado del servicio
- GET /stream -> SSE stream (EventSource)
- WS  /ws     -> WebSocket feed
- GET /generate?n=10000&sensors=100 -> generar N lecturas inmediatamente

Arranque:
1. cd services/sensor-service
2. npm install
3. npm start
