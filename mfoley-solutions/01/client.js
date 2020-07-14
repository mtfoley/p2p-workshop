const net = require('net');
const { pipeline } = require('stream');
const { exit } = require('process');
const onServerData = (data)=>{
    process.stdout.write(data+"Enter a Message:\n")
}
class Client {
    constructor(){
        let client = null
        client = net.createConnection({port:1337},()=>{
            process.stdin.on('data',(data)=>{
                client.write(data)
            })
            client.on('data',onServerData)
            client.on('close',()=>{
                console.error('Server Closed Connection')
                exit()
            })
        })
        client.on('error',(error)=>{
            console.error(error);
            exit();
        })
        onServerData('')
    }
}
new Client()