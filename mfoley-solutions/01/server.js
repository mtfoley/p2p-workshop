const net = require('net')
class Server {
    constructor(){
        this.connections = []
        let self = this
        this.srv = net.createServer((socket)=>{
            self.connections.push(socket);
            socket.on('data',(data)=>{
                console.log('Message From Client',data.toString())
                socket.write(data.toString())
            })
        })
        this.srv.listen(1337)
    }
}
new Server();
