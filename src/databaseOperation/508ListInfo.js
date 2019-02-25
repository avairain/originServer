import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient
let DB = null
let connectTable = null
let option = {}
let _dbOption = {
  useNewUrlParser: true,
  reconnectTries: 3,
  auto_reconnect: true,
  poolSize : 40,
  connectTimeoutMS: 500
};
class ListInfo {
  constructor (url = 'mongodb://140.143.239.174:27017', database = 'yaoxingyu', table = 'infoList') {
    this.init({ url, database, table})
  }
  async init ({ url, database, table}) {
    option = { url, database, table}
    await this._connect({ url, database, table})
      .then(table => {
        connectTable = table
        // connectTable.drop()
      })
  }
  _connect ({ url, database, table}) {
    return new Promise( res => {
      MongoClient.connect(url, _dbOption, (err, db) => {
        if (err) throw err
        console.log('connected')
        DB = db
        res(db.db(database).collection(table))
      })
    })
  }
  find (option) {
    option.info = option.info || {}
    let obj = {
      info: {}
    }
    for (const key in option.info) {
      if (option.info.hasOwnProperty(key)) {
        if(key !== 'id') {
          obj.info[key] = { $regex: option.info[key]}
        }
      }
    }
    option.info.isdelete = 0
    console.log('find:', option.info)
    connectTable.find(option.info).toArray(function (err, result) {
      if (err) option.errorCallback(err)
      result && result.forEach(v => {
        delete v._id
        delete v.isdelete
      })
      option.callback(result)
    })
  }
  insert (option) {
    option.info.isdelete = 0
    connectTable.insertOne(option.info, (err, result) => {
      if (err) option.errorCallback(err)
      option.callback(result)
    })
  }
  delete (option) {
    option.info.isdelete = 1
    this.update(option)
  }
  update (option) {
    let uName = option.info.uName
    let id = option.info.id
    let newObj = { $set: option.info }
    connectTable.updateOne({ id, uName }, newObj, (err, result) => {
      if (err) option.errorCallback && option.errorCallback(err)
      option.callback(result)
    })
  }
  destory () {
    connectTable.drop()
  }
  close () {
    DB && DB.close()
    DB = null
  }
}
export default ListInfo