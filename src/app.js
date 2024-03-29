let express = require('express')
let ps = require('path')
let router = require('./router/router')
// import router from './router'
var bodyParser=require('body-parser')
// let operation = require('./databaseOperation')

let app = express()
// let o = new operation.Create()

// setTimeout(function () {
  // o.close()
// }, 1000 * 3)
// console.log(o.close())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use(express.static(ps.join(__dirname, '../../src/', 'webapp')))
app.use('/files', express.static(ps.join(__dirname, '..', 'files')))
app.use(router)

process.on('uncaughtException', function (err) { 
  console.log('Caught exception: ' + err); 
}); 

app.listen('6060', () => {
  console.log(6060)
})
