const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const CLOSE = '.exit';

const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (rawData) => {
    const data = JSON.parse(rawData);

    if (data.message === CLOSE) {
      ws.close();
    }

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(rawData);
      }
    });
  });
});

server.listen(process.env.PORT || 80, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});