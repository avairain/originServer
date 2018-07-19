let express = require('express')
let ps = require('path')
let router = require('./router')
let app = express()
/* http://www.jueshitangmen.info/zhetian/1971.html */
app.use(express.static(ps.join(__dirname, 'public')))
app.use(router)
process.on('uncaughtException', function (err) { 
  console.log('Caught exception: ' + err); 
}); 

app.listen(6060, () => {
  console.log(6060)
})
