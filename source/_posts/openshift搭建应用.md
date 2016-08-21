---
title: openshift搭建应用
date: 2016-08-13 11:08:05
tags: Node.js
---


恩，最后感谢openshift,aliyun友情提供。

<!-- more -->



## 创建应用
首先在openshift上添加一个应用,然后选择自定义应用。
![](https://cloud.githubusercontent.com/assets/7932380/17831726/7a94b83e-6723-11e6-9c5c-5a800d06cba6.png)
![](https://cloud.githubusercontent.com/assets/7932380/17831733/b200f198-6723-11e6-9e02-49d27825b7a3.png)
修改Public URL的为自定义的名字，然后点击Create Application，注意下这里创建的速度的很慢,一个字:等
![](https://cloud.githubusercontent.com/assets/7932380/17831740/0c8acf8a-6724-11e6-9f81-14307bd6df6f.png)


## 上传代码
创建应用完毕后，按照页面指示clone,添加一个package.json文件,commit,push一份demo代码到openshift.
``` bash
git clone ssh://${YOUR CUSTOM PATH}/~/git/node.git/
cd node/
npm init -y
git add package.json
git commit -m 'My changes'
git push

```
![](https://cloud.githubusercontent.com/assets/7932380/17831789/8cc6c0c2-6725-11e6-9c0b-73b8c1366964.png)
此时页面是这样，注意页面html源代码在diy目录下的index.html
![](https://cloud.githubusercontent.com/assets/7932380/17831799/fd2a0536-6725-11e6-9a1f-ad16cafc71a9.png)

## 创建一个express应用
``` bahs
 cd diy/
 npm i ejs --save
 npm i express --save
 touch index.js
```
index.js的代码是
``` js
/**
 * Created by kimown on 16-8-13.
 */

var express = require('express');
var app = express();
var pkgjson = require('./package.json');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.json({
        alinode:process.alinode,
        version:process.version,
        pkgjson:pkgjson.name
    });
});



//  Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_DIY_IP||'127.0.0.1';
var port    = process.env.OPENSHIFT_DIY_PORT || 8080;


//  And start the app on that interface (and port).
app.listen(port, ipaddr, function() {
    console.log('%s: Node (version: %s) %s started on %s:%d ...', Date(Date.now() ), process.version, process.argv[1], ipaddr, port);
});

```
这里的代码逻辑很简单，主要是读取openshift预设值的环境变量得到ip和port，然后打印出node的版本，可以使用 node index.js 本地查看。

## hook openshift启动应用进程
在[这篇文章](https://blog.openshift.com/a-paas-that-runs-anything-http-getting-started-with-diy-applications-on-openshift/)，介绍了如何启动应用的过程，是通过使用.openshift/action_hooks目录下start和stop两个可执行文件实现启动应用，停止应用的，里面没有什么神秘的，里面都是预设置的shell脚本文件。

依葫芦画瓢修改两个可执行文件
start
``` bash
#!/bin/bash
# The logic to start up your application should be put in this
# script. The application will work only if it binds to
# $OPENSHIFT_DIY_IP:8080
#nohup $OPENSHIFT_REPO_DIR/diy/testrubyserver.rb $OPENSHIFT_DIY_IP $OPENSHIFT_REPO_DIR/diy |& /usr/bin/logshifter -tag diy &
npm install
nohup node $OPENSHIFT_REPO_DIR/index.js &
```

stop
``` bash
#!/bin/bash
source $OPENSHIFT_CARTRIDGE_SDK_BASH

# The logic to stop your application should be put in this script.
#if [ -z "$(ps -ef | grep testrubyserver.rb | grep -v grep)" ]
#then
#    client_result "Application is already stopped"
#else
#    kill `ps -ef | grep testrubyserver.rb | grep -v grep | awk '{ print $2 }'` > /dev/null 2>&1
#fi


if [ -z "$(ps -ef | grep index.js | grep -v grep)" ]
then
    client_result "Application is already stopped"
else
    kill `ps -ef | grep index.js | grep -v grep | awk '{ print $2 }'` > /dev/null 2>&1
fi

```


注意这里我们需要设置npm的位置，因为在openshift里面，我们没有root权限，唯一可以持久化文件的目录是$OPENSHIFT_DATA_DIR这个目录,如果想在其他目录操作会报权限不足这个错误,详细的各个环境变量的文档,[点击这里](https://developers.openshift.com/managing-your-applications/environment-variables.html).
![](https://cloud.githubusercontent.com/assets/7932380/17832039/89ceafa4-672c-11e6-9b33-f5cfc123b232.png)
![](https://cloud.githubusercontent.com/assets/7932380/17832137/58500688-672e-11e6-98ac-f08b35bfd956.png)

所以，start文件需要修改,指定npm的一些目录,在[npm文档](https://docs.npmjs.com/files/npmrc)描述了，.npmrc文件的4种位置，
那我们在package.json目录下创建.npmrc和.npm文件就可以避免没有权限问题了。
start修改如下
``` bash
#!/bin/bash
# The logic to start up your application should be put in this
# script. The application will work only if it binds to
# $OPENSHIFT_DIY_IP:8080
#nohup $OPENSHIFT_REPO_DIR/diy/testrubyserver.rb $OPENSHIFT_DIY_IP $OPENSHIFT_REPO_DIR/diy |& /usr/bin/logshifter -tag diy &


export npm_config_cache=$OPENSHIFT_REPO_DIR/diy/.npm
export npm_config_userconfig=$OPENSHIFT_REPO_DIR/diy/.npmrc

cd $OPENSHIFT_REPO_DIR/diy
npm install
nohup node $OPENSHIFT_REPO_DIR/index.js &
```

![](https://cloud.githubusercontent.com/assets/7932380/17832233/5c0e9ad0-6730-11e6-8c8b-d5c5920decc0.png)
这里可以看到是由于node自身的版本太低了,ejs找不到对应可用的版本，那只能使用自定义node的版本了，下面一篇文章我会讲到使用alinode来启动应用.


