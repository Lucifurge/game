const WebSocket = require('ws');
const express = require('express');
const path = require('path');

// Initialize Express server
const app = express();
const port = process.env.PORT || 3000; // Use environment port for production

// Serve static files (HTML, JS, CSS, assets)
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the index.html file if it exists
});

// HTTP server
const server = app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});

// WebSocket server for multiplayer
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New player connected');

  // Broadcast player data to all clients
  ws.on('message', (message) => {
    console.log('Received message: ', message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message); // Broadcast to other players
      }
    });
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Player disconnected');
  });
});
