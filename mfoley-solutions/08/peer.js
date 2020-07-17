require('lookup-multicast-dns/global')
const register = require('register-multicast-dns')
const topology = require('fully-connected-topology')
const hashToPort = require('hash-to-port')
const usage = 'Usage: node peer {my-username} {other-username}\n'
            + 'Example: node peer matt laura'
const argv = process.argv.slice(2)
const getAddress = function(username){
  return `${username}.local:${hashToPort(username)}`
}
if(argv.length < 2){
  console.log(usage)
  process.exit()
}
const mySenderID = ('i'+Math.random()).substring(4)
let seq = 0
let lastMessages = {}
let streams = {}
const nickname = argv[0]
const me = getAddress(nickname)
register(nickname+'.local')
const peers = [getAddress(argv[1])]
const top = topology(me,peers)
console.log(me,peers)
process.stdin.on('data', function (data) {
  seq++
  const encoded = encode(data)
  process.stdout.write(getChatText(decode(encoded)))
  for(var addr in streams){
    streams[addr].write(encoded)
  }
})
top.on('connection',function(socket,peer){
    socket.on('data', function (data) {
        const decoded = decode(data)
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
      sender:mySenderID,
      seq:seq
    })
    return json
  }
function isNewestMessage(data){
  if(data.sender == mySenderID) return false
  if(data.sender && data.seq){
    if(
      !lastMessages[data.sender]
      || data.seq > lastMessages[data.sender]){
      lastMessages[data.sender] = data.seq
      return true
    }
  }
  return false
}
function getChatText(data){
  if(data.nickname && data.message && data.sender && data.seq) return `[ ${data.nickname} ]:\n${data.message}`
}
function decode(json){
    try {
      return JSON.parse(json)
    } catch(e){
      return {}
    }
  }