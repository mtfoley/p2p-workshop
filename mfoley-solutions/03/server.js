const net = require('net')
let streams = {}
let id=0;
const getUID = function(){
    return 'u'+id++;
}
const sendToPeers = function(sender,data){
    for(var uid in streams){
        if((''+sender) !== (''+uid)) streams[uid].write(data)
    }
}
const server = net.createServer(function (socket) {
  const uid = getUID();
  streams[uid] = socket
  console.log(`Client Connected: ${uid}`)
  socket.on('data', function (data) {
    sendToPeers(uid,data)
  })
  socket.on('error',console.error)
  socket.on('close',function(){
    delete streams[uid]
    console.log(`Client Disconnected: ${uid}`)
  });
})

server.listen(1337)