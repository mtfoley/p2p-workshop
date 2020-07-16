const topology = require('fully-connected-topology')
const usage = 'Usage: node peer {username} {address} {peer-1-address} .. {peer-n-address}\n'
            + 'Example: node peer matt localhost:4000 localhost:4001 localhost:4002'
const argv = process.argv.slice(2)
if(argv.length < 3){
  console.log(usage)
  process.exit()
}
const id = ('i'+Math.random()).substring(4)
let seq = 0
let lastMessages = {}
let streams = {}
const nickname = argv[0]
const me = argv[1]
const peers = argv.slice(2)
const top = topology(me,peers)
top.on('connection',function(socket,peer){
    process.stdin.on('data', function (data) {
        seq++
        socket.write(encode(data))
    })
    socket.on('data', function (data) {
        decoded = decode(data)
        if(isNewestMessage(decoded)){ 
          process.stdout.write(getChatText(decoded))
          for(var addr in streams){
            if(addr !== peer) streams[addr].write(data)
          }
        }
    })
    streams[peer] = socket
    socket.on('close',function(){
      delete streams[peer]
    })
})

function encode(data){
    const json = JSON.stringify({
      nickname:nickname,
      message:data.toString(),
      sender:id,
      seq:seq
    })
    return json
  }
function isNewestMessage(data){
  if(data.sender == id) return false
  if(data.sender && data.seq){
    if(!lastMessages[data.sender]){
      lastMessages[data.sender] = data.seq
      return true
    } 
    return (data.seq > lastMessages[data.sender])
  }
  return false
}
function getChatText(data){
  if(data.nickname && data.message && data.sender && data.seq) return `[ ${data.nickname} # ${data.sender}-${data.seq}]:\n${data.message}`
}
function decode(json){
    try {
      return JSON.parse(json)
    } catch(e){
      return {}
    }
  }