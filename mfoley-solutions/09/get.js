const level = require('level')
const dbName = "./test.db"
var db = level(dbName)
db.get('hello',(error,msg)=>{
    console.log(`value at hello: ${msg}`)
})
