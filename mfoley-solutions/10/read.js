const logs = require('./logs')()
//const peer = 'a-peer-id'
//let seq = 0
let stream = logs.createReadStream({valueEncoding:'utf-8'})
stream.on('data',console.log)