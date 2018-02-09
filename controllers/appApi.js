/**
 * Created by tangsicheng on 2018/1/30.
 */
var config = require('../config');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var Version = require('../db/model/version');
var md5 = require('js-md5')

const format = ({resCode = 0, msg = 'success', data = {}}) => {
    return {
        resCode,
        msg,
        data
    }
}

const requestZip = ({res, apps, appName, platform, version, jsVersion, isDiff}) => {
    getNewestInfo({ appName, platform, version}).then(newests => {
        if (!newests || !newests.length) {
            console.log('error');
            var err = new Error('Not Found');
            err.status = 404;
            return next(err);
        }
        if(isDiff == 0 || isDiff === 'false' || isDiff === false) {
            console.log('请求全量包');
            // 请求全量包
            res.send(format({
                msg: "请求全量包成功",
                data: {
                    diff: false,
                    path: `${newests[0].jsPath}/${newests[0].jsVersion}.zip`
                }
            }))
            return
        }
        // 请求差分包
        if(!apps.length){
            // 不存在jsVersion 当前包信息可能被篡改 直接返回最新版本全量包
            console.log('不存在jsVersion 当前包信息可能被篡改 直接返回最新版本全量包')
            res.send(format({
                msg: "jsVersion 不存在",
                data: {
                    diff: false,
                    path: `${newests[0].jsPath}/${newests[0].jsVersion}.zip`
                }
            }))
        }else {
            if(newests[0].jsVersion === jsVersion) {
                // 存在 jsVersion 并且是最新
                res.send(format({
                    resCode:4000,
                    msg: "当前版本已是最新，不需要更新"
                }))
            } else {
                // 存在 jsVersion 但不是最新
                console.log('存在 jsVersion 但不是最新')
                console.log(jsVersion);
                console.log(`${newests[0].jsPath}/${jsVersion}.zip`)
                res.send(format({
                    msg: "当前版本需要更新",
                    data: {
                        diff: true,
                        jsVersion: newests[0].jsVersion,
                        //有报错
                        path: `${newests[0].jsPath}/${jsVersion}.zip`
                    }
                }))
            }
        }
    })
}
/**
 * 通过app的名字和设备对应的版本号，返回相应的数据
 *
 * */
const getNewestInfo = ({appName, platform, version}) => {
    let params = {
        appName
    }
    params[platform] = version;
    return Version.find(params).sort({ timestamp : 'desc'});


}



const APPAPI = {};
APPAPI.downloadIncrementZip = (req, res, next) => {

    var zipName = req.param('zipName');
    //TODO 这里应该做一个非空判断，如果为空，应该去error
    let file = config.zipPath+'/'+zipName;
    console.log(file);
    fs.exists(file,(isExist)=>{
        "use strict";
        if(isExist){
            var filename = path.basename(file);
            var mimetype = mime.lookup(file);        //匹配文件格式

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);
            var filestream = fs.createReadStream(file)

            filestream.on('data', function(chunk) {
                res.write(chunk);
            });
            filestream.on('end', function() {
                res.end();
            });
        } else {
            console.log('error');
            var err = new Error('Not Found');
            err.status = 500;
            return next(err);
        }
    })
};

APPAPI.add = (req, res, next) => {
     console.log(req.body);
     let version = new Version(req.body)

     version.save(() => {
         res.send(format({
             data: 'success'
         }))
     })
 };
APPAPI.check = (req, res, next) => {
    let { appName, jsVersion, isDiff = true } = req.query,
        platform = !!req.query.iOS ? 'iOS': 'android',
        version = req.query[platform],
        checkParams = {
            appName,
        }
    console.log('app>>>>>>>'+appName);
    if(jsVersion) checkParams['jsVersion'] = jsVersion
    checkParams[platform] = version
    Version.find(checkParams, (err, apps) =>{
        if (err) { return next(err) }
        requestZip({
            res, apps, appName, platform, version, jsVersion, isDiff
        })
    })
};
APPAPI.test = (req, res, next) => {
    res.setHeader("200", {'Content-Type': 'application/json;charset=UTF-8'});
    return res.send({
        resCode:'0',
        msg:null,
        data:'实际接口请求成功'
    });
};

module.exports = APPAPI;