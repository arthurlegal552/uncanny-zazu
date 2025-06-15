const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Echo back to client for testing
    ws.send(`Server received: ${message}`);
  });
});