const level = require('level')
const dbName = "./test.db"
var db = level(dbName)
db.put('hello','world')