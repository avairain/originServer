var MongoClient = require('mongodb').MongoClient

const url = 'mongodb://140.143.239.174:27017'
const database = 'yaoxingyu'
const table = 'yaoxingyu_rain'
let timer = null

const Operation = function () {
  this.init()
}

Operation.prototype.init = async function () {
  console.log(1)
  await this.connect()
  this.connectTimeOut()
  console.log(4)
}

Operation.prototype.connect = async function () {
  console.log(2)
  await new Promise((res) => {
    this.db || MongoClient.connect(url, {useNewUrlParser:true}, (err, db) => {
      console.log(3)
      if (err) throw err
      console.log("数据库已创建!")
      this.db = db
      this.dbo = db.db(database)
      this[table] = this.dbo.collection(table)
      res()
      // db.close()
    })
  })
}

Operation.prototype.close = function () {
  this.db && this.db.close()
  this.db = null
  console.log(this.db)
  clearTimeout(timer)
  console.log("数据库已关闭!")
}

Operation.prototype.connectTimeOut = function () {
  clearTimeout(timer)
  const _this = this
  timer = setTimeout(function () {
    _this.close()
    clearTimeout(timer)
  }, 1000 * 60 * 60)
}

Operation.prototype.insert = function (option) {
  // this.db.db('rain').insertOne()
  this[table].insertOne(option.info, (err, result) => {
    if (err) option.errorCallback(err)
    option.callback(result)
  })
}

Operation.prototype.delete = function (option) {
  // this.db.db('rain').insertOne()
  option.info.isdelete = 1
  this.update()
}

Operation.prototype.update = function (option) {
  console.log(option)
  // this.db.db('rain').insertOne()
  let id = option.info.id
  let newObj = { $set: option.info }
  this[table].updateOne({ id }, newObj, (err, result) => {
    if (err) option.errorCallback(err)
    console.log(result)
    option.callback(result)
  })
}

Operation.prototype.delete = function (option) {
  // this.db.db('rain').insertOne()
  this[table].deleteOne(option.info, (err, result) => {
    if (err) option.errorCallback(err)
    option.callback(result)
  })
}

Operation.prototype.find = function (option) {
  option.info = option.info || {}
  for (const key in option.info) {
    if (option.info.hasOwnProperty(key)) {
      if(key !== 'id') {
        option.info[key] = { $regex:option.info[key]}
      }
    }
  }
  option.info.isdelete = 0
  this[table].find(option.info).toArray(function (err, result) {
    console.log(err)
    if (err) option.errorCallback(err)
    result.forEach(v => {
      delete v._id
      delete v.isdelete
    })
    // console.log(result)
    option.callback(result)
  })
}


/* class Operation {
  constructor () {
    super()
    this.init()
  }
  init () {
    this.connect()
  }
  connect () {
    MongoClient.connect(url, (err, db) => {
      if (err) throw err
      console.log("数据库已创建!")
      this.db = db
      // db.close()
    })
  }
  close () {
    this.db.close()
  }
} */

module.exports.Create = Operation
