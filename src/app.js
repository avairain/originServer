let express = require('express')
let app = express()
let router = require('./router')

/* http://www.jueshitangmen.info/zhetian/1971.html */
app.use('/static', express.static('public'))
app.use(router)

process.on('uncaughtException', function (err) { 
  console.log('Caught exception: ' + err); 
}); 

app.listen(6060, () => {
  console.log(6060)
})
