let express = require('express')
let router = express.Router()
let http = require('http')
let fs = require("fs")
let ps = require('path')
const operation = require('../databaseOperation')
const o = new operation.Create()
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

router.all('*', (req, res, next) => {
  console.log(req.path)
  // if(req.path === '/' || req.path === '/index.html') {
  //   // fs.readFile(ps.join(__dirname, '../index.html'), (err, data) => {
  //     // if (err) throw err;
  //     // console.log(data)
  //     res.sendfile(ps.join(__dirname, '../public/index.html'))
  //   // })
  // } else {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.append("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.append("X-Powered-By",' 3.2.1')
    res.append("Content-Type", "application/json;charset=utf-8");
    next()
  // }
})

router.post('/add', (req, res, next) => {
  let info = req.body
  let p = new Promise((resolve, reject) => {
    o.findAll({
      callback: result => {
        resolve(result)
      },
      errorCallback: err => {
        res.send({
          status: '0100',
          result: err
        })
      }
    })
  })
  p
    .then(data => {
      let id = data.length ? data[data.length-1].id : 0
      info.id = id + 1
      info.isdelete = 0
      o.insert({
        info,
        callback: result => {
          res.send({
            status: '0000',
            result
          })
        },
        errorCallback: err => {
          res.send({
            status: '0100',
            result: err
          })
        }
      })
    })
})

router.post('/getList', (req, res, next) => {
  o.find({
    info: req.body,
    callback: result => {
      res.send({
        status: '0000',
        result
      })
    },
    errorCallback: err => {
      res.send({
        status: '0100',
        result: err
      })
    }
  })
})

router.post('/delete', (req, res, next) => {
  let info = req.body
  info.isdelete = 1
  o.update({
    info,
    callback: result => {
      res.send({
        status: '0000',
        result
      })
    },
    errorCallback: err => {
      res.send({
        status: '0100',
        result: err
      })
    }
  })
})

router.post('/update', (req, res, next) => {
  o.update({
    info: req.body,
    callback: result => {
      res.send({
        status: '0000',
        result
      })
    },
    errorCallback: err => {
      res.send({
        status: '0100',
        result: err
      })
    }
  })
})

router.get("/pc/:data?", (req, res1) => {
  if(/favicon.ico/.test(req.path)) return res1.send(200)
  url = hostname + path + "/" + (req.params.data || '1971.html')
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
      let s = str.match(/下一篇[\s|\S]*上一篇/g)
      let a = str.slice(start, end)
      let h =  a.match(/"\S*"/)[0].replace(/"/g,"").match(/[0-9]{1}\S{1,}/g)[0]
      console.log(s[0].replace(/"http:\S*"/,`"/pc/${h}"`))
      str = str.match(/<p>[\S]*<\/p>/g).join('')
      str = title + str
      str += `<a href="/pc/${h}">下一章</a>`
      fs.writeFile(ps.join(__dirname, `../file/${h}`), str, err => {})
      res1.send(str)
    })
  })
})

module.exports = router
