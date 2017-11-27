
var express = require('express')
var socket = require('socket.io')

var app = express()
var server = app.listen(3000)
app.use(express.static(__dirname))

var io = socket(server)

io.sockets.on('connection', newConnection)

function newConnection(socket) {
  console.log(socket.id + ' just connected');

  socket.on('plive', (data) => {
    console.log(data);
    socket.broadcast.emit('plive', data);
  });
}
