var topology = require('fully-connected-topology')
// usage: node peer my-ip 
var me = process.argv[2] // first argument is gonna be your own address
var peers = process.argv.slice(3) // the rest should be the peers you want to connect to
var top = topology(me,peers)
top.on('connection',function(connection,peer){
    console.log(`now connected to ${peer}`)
})