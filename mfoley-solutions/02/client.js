var net = require('net')
var socket = net.connect(1337, 'localhost')

process.stdin.on('data', function (data) {
  socket.write(data)
})

socket.on('data', function (data) {
  process.stdout.write(data)
})