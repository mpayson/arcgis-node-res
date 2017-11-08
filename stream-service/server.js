const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// init express and server
const app = express();
const server = http.createServer(app);

// create static server for client and websocket
app.use(express.static(__dirname));
const wss = new WebSocket.Server({server});

// util functions to generate a point
const getRandom = (min, max) => Math.random() * (max - min) + min;
function getPoint() {
  const x = getRandom(-73.975, -73.990);
  const y = getRandom(40.718, 40.732);
  const date = Date.now();
  const point = {
    geometry: {
      "x": x,
      "y": y
    },
    attributes: {
      "timeStamp": date
    }
  };
  return JSON.stringify(point);
}

// define the broadcast method so all subscribers can hear updates
wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// broadcast a new point every so often
setInterval(() => wss.broadcast(getPoint()), 1000);

// listen!
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});