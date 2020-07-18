require('lookup-multicast-dns/global')
const register = require('register-multicast-dns')
const topology = require('fully-connected-topology')
const hashToPort = require('hash-to-port')
const level = require('level')
const scuttleup = require('scuttleup')
const argv = process.argv.slice(2)

if(argv.length < 2){
  const usage = 'Usage: node peer {my-username} {other-username-1} ..{other-username-n}\n'
  + 'Example: node peer matt laura chris andy'  
  console.log(usage)
  process.exit()
}
const me = argv[0]
const peers = argv.slice(1)
const logs = scuttleup(level(me+'.db'),{valueEncoding:'json'})
const top = topology(getAddress(me),peers.map(getAddress))
register(me)

top.on('connection',function(socket,peer){
  console.log('connected to '+peer)
  socket.pipe(logs.createReplicationStream({live:true})).pipe(socket)
})
logs.createReadStream({live:true}).on('data',function(data){
  console.log(`[ ${data.entry.username} ]> ${data.entry.message}`)
})
process.stdin.on('data',function(data){
  const entry = {username:me,message:data.toString().trim()}
  logs.append(entry)
})
  
function getAddress(username){
    return `${username}.local:${hashToPort(username)}`
}
function makeLogs(username){
  return 
}