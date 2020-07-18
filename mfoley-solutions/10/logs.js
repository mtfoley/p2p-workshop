const level = require('level')
const scuttleup = require('scuttleup')
module.exports = function(){
    return scuttleup(level('logs.db'))
}