const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const request = require('request');
const txs = require('./txs');
let idx = 0;
let counter;

let startTime = null;

function start() {
  server.listen(3000, () => {
    console.log('Tokenizer listening on port 3000');
  });

  app.get('/', (req, res) => {
    console.log(counter);
    res.send(txs[idx % txs.length]);
    idx++;
    counter++;
  });

  io.on('connection', (socket) => {
    startTime = Date.now();
    counter = 0;
    console.log('Socket connected');
    sendTx(socket);

    socket.on('getTx', function (data) {
      sendTx(socket);
    });
  });
}

function sendTx(socket) {
  socket.emit('tx', txs[idx % txs.length]);
  idx++;
  counter++;
  if (counter % 100000 === 0) {
    console.log((Date.now() - startTime) / 1000);
  }
}

module.exports = {
  start: start
}