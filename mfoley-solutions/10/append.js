const logs = require('./logs')()
//const peer = 'a-peer-id'
//let seq = 0
process.stdin.on('data',function(data){
    logs.append(data)
})
