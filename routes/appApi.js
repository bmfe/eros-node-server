/**
 * Created by tangsicheng on 2018/1/30.
 */
var express = require('express');
var router = express.Router();
var appApi = require('../controllers/appApi');
//
/* GET users listing. */
router.get('/downloadIncrementZip/:zipName', appApi.downloadIncrementZip);

router.post('/add',appApi.add);

router.get('/check', appApi.check);


module.exports = router;
