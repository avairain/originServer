'use strict';

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _ListInfo = require('../databaseOperation/508ListInfo');

var _ListInfo2 = _interopRequireDefault(_ListInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require("fs");
var ps = require('path');
var multer = require('multer');

var _508ListInfo = new _ListInfo2.default();

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, ps.join(__dirname, '../..', '/files'));
  },
  filename: function filename(req, file, cb) {
    console.log(file.originalname.split('.'));
    var type = file.originalname.split('.')[1];
    file.type = type;
    file.name = file.fieldname + '-' + Date.now() + '.' + file.type;
    cb(null, file.name);
  }
});
var upload = multer({ /* dest: 'files/' */storage: storage });

var operation = require('../databaseOperation');
var o = new operation.Create();
var url = 'http://www.jueshitangmen.info';
var hostname = 'http://www.jueshitangmen.info';
var port = '80';
var path = '/zhetian';
var h = process.argv.findIndex(function (v) {
  return v === '--host';
});
var b = process.argv.findIndex(function (v) {
  return v === '--book';
});

if (h + 1) {
  hostname = process.argv[h + 1] || hostname;
}

if (b + 1) {
  path = '/' + process.argv[b + 1] || path;
}

router.all('*', function (req, res, next) {
  console.log(req.path);
  // if(req.path === '/' || req.path === '/index.html') {
  //   // fs.readFile(ps.join(__dirname, '../index.html'), (err, data) => {
  //     // if (err) throw err;
  //     // console.log(data)
  //     res.sendfile(ps.join(__dirname, '../public/index.html'))
  //   // })
  // } else {
  // res.append("Access-Control-Allow-Origin", "*");
  // res.append("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  // res.append("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  // res.append("X-Powered-By",' 3.2.1')
  // res.append("Content-Type", "application/json;charset=utf-8");
  next();
  // }
});

router.post('/upload', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  res.send({
    error: 0,
    url: 'http://127.0.0.1:6060/files/' + req.file.name
  });
});

router.post('/add', function (req, res, next) {
  var info = req.body;
  var p = new Promise(function (resolve, reject) {
    o.find({
      callback: function callback(result) {
        resolve(result);
      },
      errorCallback: function errorCallback(err) {
        res.send({
          status: '0100',
          result: err
        });
      }
    });
  });
  p.then(function (data) {
    var id = data.length ? data[data.length - 1].id : 0;
    info.id = id + 1;
    info.isdelete = 0;
    o.insert({
      info: info,
      callback: function callback(result) {
        res.send({
          status: '0000',
          result: result
        });
      },
      errorCallback: function errorCallback(err) {
        res.send({
          status: '0100',
          result: err
        });
      }
    });
  });
});

router.post('/getList', function (req, res, next) {
  o.find({
    info: req.body,
    callback: function callback(result) {
      res.send({
        status: '0000',
        result: result
      });
    },
    errorCallback: function errorCallback(err) {
      res.send({
        status: '0100',
        result: err
      });
    }
  });
});

router.post('/delete', function (req, res, next) {
  var info = req.body;
  info.isdelete = 1;
  o.update({
    info: info,
    callback: function callback(result) {
      res.send({
        status: '0000',
        result: result
      });
    },
    errorCallback: function errorCallback(err) {
      res.send({
        status: '0100',
        result: err
      });
    }
  });
});

router.post('/update', function (req, res, next) {
  o.update({
    info: req.body,
    callback: function callback(result) {
      res.send({
        status: '0000',
        result: result
      });
    },
    errorCallback: function errorCallback(err) {
      res.send({
        status: '0100',
        result: err
      });
    }
  });
});

router.get("/pc/:data?", function (req, res1) {
  if (/favicon.ico/.test(req.path)) return res1.send(200);
  url = hostname + path + "/" + (req.params.data || '1971.html');
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
  http.get(url, function (res) {
    var str = "";
    res.on('data', function (e) {
      str += e;
    });
    res.on('end', function () {
      var end = str.match(/上一篇/).index;
      var start = str.match(/下一篇/).index;
      var title = str.match(/<h1>[\S|\s]*<\/h1>/);
      var s = str.match(/下一篇[\s|\S]*上一篇/g);
      var a = str.slice(start, end);
      var h = a.match(/"\S*"/)[0].replace(/"/g, "").match(/[0-9]{1}\S{1,}/g)[0];
      console.log(s[0].replace(/"http:\S*"/, '"/pc/' + h + '"'));
      str = str.match(/<p>[\S]*<\/p>/g).join('');
      str = title + str;
      str += '<a href="/pc/' + h + '">\u4E0B\u4E00\u7AE0</a>';
      fs.writeFile(ps.join(__dirname, '../file/' + h), str, function (err) {});
      res1.send(str);
    });
  });
});

router.post('/get508InfoList', function (req, res) {
  _508ListInfo.find({
    info: req.body,
    callback: function callback(result) {
      res.send({
        status: '0000',
        result: result
      });
    },
    errorCallback: function errorCallback(err) {
      res.send({
        status: '0100',
        result: err
      });
    }
  });
});

router.post('/add508Member', function (req, res) {
  _508ListInfo.find({
    info: { uName: req.body.uName },
    callback: function callback(result) {
      if (result && result.length) {
        res.send({
          status: '0001',
          result: [],
          message: '不可重复添加'
        });
      } else {
        _508ListInfo.insert({
          info: req.body,
          callback: function callback(result) {
            res.send({
              status: '0000',
              result: result
            });
          }
        });
      }
    },
    errorCallback: function errorCallback(err) {
      res.send({
        status: '0100',
        result: err
      });
    }
  });
});

router.post('/delete50Member', function (req, res) {
  _508ListInfo.update({
    info: req.body,
    callback: function callback(result) {
      res.send({
        status: '0000',
        result: result
      });
    }
  });
});

router.post('/update508Member', function (req, res) {
  _508ListInfo.find({
    info: { uName: req.body.uName, id: req.body.id },
    callback: function callback(result) {
      console.log(result);
      if (result && result.length) {
        _508ListInfo.update({
          info: req.body,
          callback: function callback(result) {
            res.send({
              status: '0000',
              result: result
            });
          }
        });
      } else {
        res.send({
          status: '0004',
          result: [],
          message: '查不到当前数据'
        });
      }
    },
    errorCallback: function errorCallback(err) {
      res.send({
        status: '0100',
        result: err
      });
    }
  });
});

router.post('/ydyl', function (req, res) {
  _axios2.default.post('http://si.12333.gov.cn/118733/RemoteQuery003.jspx', {
    'aab299': '',
    'akb021': '',
    'yldj': '',
    'akb023': '',
    'notkeyflag': 1
  }, {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'JSESSIONID=9T2eNUMB7e3S-v8PoW_bfoWFZOXhKmgJgMVVtxFhtyj3W_NEEs3v!-1364551590; vcookieid=3b73286b8da54bcca6d8da5cdd95eb19',
    'Origin': 'http://si.12333.gov.cn',
    'Host': 'si.12333.gov.cn'
  }).then(function (data) {
    console.log(data.data);
    res.send(renderHTML(data.data.lists.resultset.list));
  }).catch(function (err) {
    return console.log(err);
  });
});

module.exports = router;