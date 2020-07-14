const { exit } = require('process')
var argv = process.argv.slice(2)
if(argv.length < 1){
  console.log('No Username Provided. Exiting.')
  exit()
}
const nickname = argv[0];
var net = require('net')
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
try {
  var socket = net.connect(1337, 'localhost')

  process.stdin.on('data', function (data) {
    socket.write(encode(data))
  })
  socket.on('data', function (data) {
    process.stdout.write(decode(data))
  })
} catch(error){
  console.error(`Error Connection: ${error}`)
  exit();
}