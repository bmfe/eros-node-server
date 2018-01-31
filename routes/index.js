var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('../config')
var path = require('path')
var mime = require('mime');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
