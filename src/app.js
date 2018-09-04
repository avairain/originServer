let express = require('express')
let ps = require('path')
let router = require('./router')
var bodyParser=require('body-parser')
// let operation = require('./databaseOperation')

let app = express()
// let o = new operation.Create()

// setTimeout(function () {
  // o.close()
// }, 1000 * 3)
// console.log(o.close())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(ps.join(__dirname, 'webapp')))
app.use(router)

process.on('uncaughtException', function (err) { 
  console.log('Caught exception: ' + err); 
}); 

app.listen(6060, () => {
  console.log(6060)
})
