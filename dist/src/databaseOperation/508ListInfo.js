'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongoClient = _mongodb2.default.MongoClient;
var DB = null;
var connectTable = null;
var option = {};
var _dbOption = {
  useNewUrlParser: true,
  reconnectTries: 3,
  auto_reconnect: true,
  poolSize: 40,
  connectTimeoutMS: 500
};

var ListInfo = function () {
  function ListInfo() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'mongodb://140.143.239.174:27017';
    var database = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yaoxingyu';
    var table = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'infoList';

    _classCallCheck(this, ListInfo);

    this.init({ url: url, database: database, table: table });
  }

  _createClass(ListInfo, [{
    key: 'init',
    value: async function init(_ref) {
      var url = _ref.url,
          database = _ref.database,
          table = _ref.table;

      option = { url: url, database: database, table: table };
      await this._connect({ url: url, database: database, table: table }).then(function (table) {
        connectTable = table;
        // connectTable.drop()
      });
    }
  }, {
    key: '_connect',
    value: function _connect(_ref2) {
      var url = _ref2.url,
          database = _ref2.database,
          table = _ref2.table;

      return new Promise(function (res) {
        MongoClient.connect(url, _dbOption, function (err, db) {
          if (err) throw err;
          console.log('connected');
          DB = db;
          res(db.db(database).collection(table));
        });
      });
    }
  }, {
    key: 'find',
    value: function find(option) {
      option.info = option.info || {};
      var obj = {
        info: {}
      };
      for (var key in option.info) {
        if (option.info.hasOwnProperty(key)) {
          if (key !== 'id') {
            obj.info[key] = { $regex: option.info[key] };
          }
        }
      }
      option.info.isdelete = 0;
      console.log('find:', option.info);
      connectTable.find(option.info).toArray(function (err, result) {
        if (err) option.errorCallback(err);
        result && result.forEach(function (v) {
          delete v._id;
          delete v.isdelete;
        });
        option.callback(result);
      });
    }
  }, {
    key: 'insert',
    value: function insert(option) {
      option.info.isdelete = 0;
      connectTable.insertOne(option.info, function (err, result) {
        if (err) option.errorCallback(err);
        option.callback(result);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(option) {
      option.info.isdelete = 1;
      this.update(option);
    }
  }, {
    key: 'update',
    value: function update(option) {
      var uName = option.info.uName;
      var id = option.info.id;
      var newObj = { $set: option.info };
      connectTable.updateOne({ id: id, uName: uName }, newObj, function (err, result) {
        if (err) option.errorCallback && option.errorCallback(err);
        option.callback(result);
      });
    }
  }, {
    key: 'destory',
    value: function destory() {
      connectTable.drop();
    }
  }, {
    key: 'close',
    value: function close() {
      DB && DB.close();
      DB = null;
    }
  }]);

  return ListInfo;
}();

exports.default = ListInfo;