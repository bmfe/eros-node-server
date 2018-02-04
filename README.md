# eros热更新服务端(express+mongodb)

说明：
====================================
本demo 是针对[eros-template](https://github.com/bmfe/eros-template)（一个针对weex进行二次封装的非常优秀的框架）做的一个check版本热更新的服务端，基于[eros-publish](https://github.com/bmfe/eros-publish)做了一些小改动和添加了一些小功能。

如果对你有用的话，请右上角点个star


使用：
====================================

下载
----------------------------------------
使用git从[eros-node-server](https://github.com/shawn-tangsc/eros-node-server)主页下载项目
``` bash
git clone https://github.com/shawn-tangsc/eros-node-server
```
前期准备
----------------------------------------
+ 下列是mac下环境执行的语法，需要先安装[homebrew](https://brew.sh/)，linux下同理用相应的包管理工具下载。

```
brew install bsdiff
brew install bspatch
```


初始化
----------------------------------------
``` bash
cd eros-node-server
npm install
```


修改配置文件
----------------------------------------
1.在本项目中修改db/mongoose 下的mongodb的ip和port 为本地local path

``` bash
var mongoose = require("mongoose");
var DB_URL = 'mongodb://localhost/home'
```

2.修改根目录中的config.js 中的zipPath！

+ 下面这个路径配置的是你差分包和全量包里面的路径，可以自己去查一下

``` bash
module.exports = {
    zipPath:<eros-template 内eros.dev.js中的 diff.pwd配置的路径>
}
```


+ 下面去修改你eros-template 里面的-----》eros.dev.js

```
 'diff': {
        'pwd': <你希望差分包放的位置，这里需要注意，他会在你指定的目录下多新建一个目录>,
        'proxy': `<本项目启动后的url或者ip>:3001/app/downloadIncrementZip`
    },
```

+ 下面去修改你eros-template 里面的-----》eros.native.js

```
'url': {
        ...
        'bundleUpdate': `<本项目启动后的url或者ip>:3001/app/check`,
        ...
    },
```

生成差分包和全量包
----------------------------------------

+ 在你的eros-template 目录根据实际情况执行，eros会将你的包放到你指定的目录下面

```
eros build //生成全量包
eros build -d //生成差分包
```

启动服务器
----------------------------------------
+ 启动mongodb的本地服务

```
mongod
```

+ 在本项目的目录下，执行下列命令，这会给你在本地启动一个端口为3001的服务器

```
npm run start
```



将eros差分包或全量包信息保存到服务器
----------------------------------------
+ 执行下列命令，可以让你将eros-template里面之前生成的差分差分包和全量包的信息（<your eros project>/dist/version.json）保存的服务器上面,

```
eros build -s http://localhost:3001/app/add
```

测试
----------------------------------------

+ 然后打开你eros项目中platform对应的移动端项目就可以直接在模拟器或真机上测试热更新了。。

注意！！
-------------
+ 请注意保证你本地native.js中的version 和你原生端项目中的实际版本一致，否则将找不到对应的数据

```
	...
    'version': {
        'android': '1.0.0',
        'iOS': '1.0.0'
    },
    ...
```
