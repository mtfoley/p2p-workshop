const net = require('net')
const register = require('register-multicast-dns');
const { exit } = require('process');
if(process.argv.length < 3){
  console.log(`No Hostname provided, exiting`)
  exit()
}
register(process.argv[2].replace(/\.local$/i,'')+'.local')
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