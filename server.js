const WebSocket = require('ws');

const CLOSE = '.exit';

const wss = new WebSocket.Server({ port: 80 });

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
