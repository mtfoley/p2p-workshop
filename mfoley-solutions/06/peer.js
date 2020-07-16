const topology = require('fully-connected-topology')
const usage = 'Usage: node peer {username} {address} {peer-1-address} .. {peer-n-address}\n'
            + 'Example: node peer matt localhost:4000 localhost:4001 localhost:4002'
const argv = process.argv.slice(2)
if(argv.length < 3){
  console.log(usage)
  process.exit()
}
const nickname = argv[0]
const me = argv[1]
const peers = argv.slice(2)
const top = topology(me,peers)
top.on('connection',function(socket,peer){
    process.stdin.on('data', function (data) {
        socket.write(encode(data))
    })
    socket.on('data', function (data) {
        process.stdout.write(decode(data))
    })
})
function encode(data){
    const json = JSON.stringify({nickname:nickname,message:data.toString()})
    return json
  }

function decode(json){
    try {
      const data = JSON.parse(json)
      if(data.nickname && data.message) return `[ ${data.nickname} ]:\n${data.message}`
    } catch(e){
      return json
    }
  }