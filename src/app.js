let express = require('express')
let app = express()
let http = require('http')
let fs = require("fs")
let ps = require('path')
/* http://www.jueshitangmen.info/zhetian/1971.html */
let url = 'http://www.jueshitangmen.info'
let hostname = 'http://www.jueshitangmen.info'
let port = '80'
let path = '/zhetian'
let h = process.argv.findIndex(v => v === '--host')
let b = process.argv.findIndex(v => v === '--book')
hostname = process.argv[h+1] || hostname
path = ('/' + process.argv[b+1]) || path
app.get('*', (req, res1) => {
  if(/favicon.ico/.test(req.path)) return res1.send(200)
  url = hostname + path + req.path
  console.log(url)
  // http({
  //   hostname: 'www.qiushibaike.com',
  //   port: 443,
  //   path: '/8hr/page/5/?s=5002676',
  //   method: 'get',
  //   headers: {
  //     'Connection': 'keep-alive',
  //     'Upgrade-Insecure-Requests': '1',
  //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
  //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  //     'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'
  //   }
  // })
  http.get(
  //   {
  //   hostname,
  //   port,
  //   path,
  //   // agent: false,
  //   headers: {
  //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  //     'Accept-Encoding': 'gzip, deflate',
  //     'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6;utf-8',
  //     'Cache-Control': 'max-age=0',
  //     'Connection': 'keep-alive',
  //     'Upgrade-Insecure-Requests': '1',
  //     'Cookie': 'bdshare_firstime=1529482825983; __uid=06fd63a93a1add5d1a3d75e6f0af53c0; __51cke__=; __tins__19307232=%7B%22sid%22%3A%201530758562440%2C%20%22vd%22%3A%202%2C%20%22expires%22%3A%201530760373185%7D; __51laig__=3',
  //     'Host': hostname,
  //     'Upgrade-Insecure-Requests': '1',
  //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
  //   }
  // }
  url, res => {
    let str = ""
    res.on('data', e => {str += e} )
    res.on('end', () => {
      let end = str.match(/上一篇/).index
      let  start = str.match(/下一篇/).index
      let title = str.match(/<h1>[\S|\s]*<\/h1>/)
      let a = str.slice(start, end)
      let h =  a.match(/"\S*"/)[0].replace(/"/g,"").match(/[0-9]{1}\S{1,}/g)[0]
      str = str.match(/<p>[\S]*<\/p>/g).join('')
      str = title + str
      str += `<a href="/${h}">下一章</a>`
      fs.writeFile(ps.join(__dirname, `../file/${h}`), str, err => {})
      res1.send(str)
    })
  })
})

process.on('uncaughtException', function (err) { 
  console.log('Caught exception: ' + err); 
}); 

app.listen(6060, () => {
  console.log(6060)
})
