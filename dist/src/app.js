'use strict';

var express = require('express');
var ps = require('path');
var router = require('./router');
var bodyParser = require('body-parser');
// let operation = require('./databaseOperation')

var app = express();
// let o = new operation.Create()

// setTimeout(function () {
// o.close()
// }, 1000 * 3)
// console.log(o.close())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(ps.join(__dirname, '../../src/', 'webapp')));
app.use('/files', express.static(ps.join(__dirname, '..', 'files')));
app.use(router);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

app.listen('6060', function () {
  console.log(6060);
});