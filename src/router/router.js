let http = require('http')
let fs = require("fs")
let ps = require('path')
let multer = require('multer')
import axios from 'axios'
import ListInfo from '../databaseOperation/508ListInfo'
import { renderHTML } from '../config'
import { router } from '.'
import './simple';
// const router = require('./router');
const _508ListInfo = new ListInfo()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ps.join(__dirname, '../..', '/files'))
  },
  filename: function (req, file, cb) {
    console.log(file.originalname.split('.'))
    var type = file.originalname.split('.')[1]
    file.type = type
    file.name = file.fieldname + '-' + Date.now() + '.' + file.type
    cb(null, file.name)
  }
})
let upload = multer({/* dest: 'files/' */storage })

const operation = require('../databaseOperation')
const o = new operation.Create()
let url = 'http://www.jueshitangmen.info'
let hostname = 'http://www.jueshitangmen.info'
let port = '80'
let path = '/zhetian'
let h = process.argv.findIndex(v => v === '--host')
let b = process.argv.findIndex(v => v === '--book')

if (h + 1) {
  hostname = process.argv[h + 1] || hostname
}

if (b + 1) {
  path = ('/' + process.argv[b + 1]) || path
}

router.post('/upload', upload.single('file'), (req, res, next) => {
  console.log(req.file)
  res.send({
    error: 0,
    url: `http://127.0.0.1:6060/files/${req.file.name}`
  })
})

router.post('/add', (req, res, next) => {
  let info = req.body
  let p = new Promise((resolve, reject) => {
    o.find({
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
      let id = data.length ? data[data.length - 1].id : 0
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
    errorCallback: function (err) {
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
  if (/favicon.ico/.test(req.path)) return res1.send(200)
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
    res.on('data', e => { str += e })
    res.on('end', () => {
      let end = str.match(/上一篇/).index
      let start = str.match(/下一篇/).index
      let title = str.match(/<h1>[\S|\s]*<\/h1>/)
      let s = str.match(/下一篇[\s|\S]*上一篇/g)
      let a = str.slice(start, end)
      let h = a.match(/"\S*"/)[0].replace(/"/g, "").match(/[0-9]{1}\S{1,}/g)[0]
      console.log(s[0].replace(/"http:\S*"/, `"/pc/${h}"`))
      str = str.match(/<p>[\S]*<\/p>/g).join('')
      str = title + str
      str += `<a href="/pc/${h}">下一章</a>`
      fs.writeFile(ps.join(__dirname, `../file/${h}`), str, err => { })
      res1.send(str)
    })
  })
})

router.post('/get508InfoList', (req, res) => {
  _508ListInfo.find({
    info: req.body,
    callback: result => {
      res.send({
        status: '0000',
        result
      })
    },
    errorCallback: function (err) {
      res.send({
        status: '0100',
        result: err
      })
    }
  })
})

router.post('/add508Member', (req, res) => {
  _508ListInfo.find({
    info: { uName: req.body.uName },
    callback: result => {
      if (result && result.length) {
        res.send({
          status: '0001',
          result: [],
          message: '不可重复添加'
        })
      } else {
        _508ListInfo.insert({
          info: req.body,
          callback: result => {
            res.send({
              status: '0000',
              result
            })
          }
        })
      }
    },
    errorCallback: function (err) {
      res.send({
        status: '0100',
        result: err
      })
    }
  })
})

router.post('/delete50Member', (req, res) => {
  _508ListInfo.update({
    info: req.body,
    callback: result => {
      res.send({
        status: '0000',
        result
      })
    }
  })
})

router.post('/update508Member', (req, res) => {
  _508ListInfo.find({
    info: { uName: req.body.uName, id: req.body.id },
    callback: result => {
      console.log(result)
      if (result && result.length) {
        _508ListInfo.update({
          info: req.body,
          callback: result => {
            res.send({
              status: '0000',
              result
            })
          }
        })
      } else {
        res.send({
          status: '0004',
          result: [],
          message: '查不到当前数据'
        })
      }
    },
    errorCallback: function (err) {
      res.send({
        status: '0100',
        result: err
      })
    }
  })
})

router.post('/ydyl', (req, res) => {
  axios.post('http://si.12333.gov.cn/118733/RemoteQuery003.jspx', {
    'aab299': '',
    'akb021': '',
    'yldj': '',
    'akb023': '',
    'notkeyflag': 1,
  }, {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'JSESSIONID=9T2eNUMB7e3S-v8PoW_bfoWFZOXhKmgJgMVVtxFhtyj3W_NEEs3v!-1364551590; vcookieid=3b73286b8da54bcca6d8da5cdd95eb19',
    'Origin': 'http://si.12333.gov.cn',
    'Host': 'si.12333.gov.cn'
  })
    .then(data => {
      console.log(data.data)
      res.send(renderHTML(data.data.lists.resultset.list))
    })
    .catch(err => console.log(err))
})

module.exports = router;
