let express = require('express')
let router = express.Router()

let url = 'http://www.jueshitangmen.info'
let hostname = 'http://www.jueshitangmen.info'
let port = '80'
let path = '/zhetian'
let h = process.argv.findIndex(v => v === '--host')
let b = process.argv.findIndex(v => v === '--book')
if(h + 1) {
  hostname = process.argv[h+1] || hostname
}
if(b + 1) {
  path = ('/' + process.argv[b+1]) || path
}
// router.all('*', (req, res, next) => {
  
// })
router.get("/pc", (req, res1) => {
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
  http.get(url, res => {
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