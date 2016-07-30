---
title: react-native填坑
date: 2016-07-30 17:19:01
tags: React-Native
---

## 网络问题

使用react-native-cli初始化AwesomeProject项目时，会使用npm安装第三方依赖，会从[npm官方](http://npmjs.com/)下载，这里我们改用[cnpm镜像](https://cnpmjs.org/).

```bash
google@H:/tmp$ which react-native
/home/mdk/node/bin/react-native
google@H:/tmp$ ll /home/mdk/node/bin/react-native
lrwxrwxrwx 1 google google 45  6月 18 10:44 /home/mdk/node/bin/react-native -> ../lib/node_modules/react-native-cli/index.js*
google@H:/tmp$ cd /home/mdk/node/lib/node_modules/react-native-cli/
google@H:/home/mdk/node/lib/node_modules/react-native-cli$ l
index.js*  node_modules/  package.json  README.md
google@H:/home/mdk/node/lib/node_modules/react-native-cli$ vi index.js
```

这里看下react-native-cli[代码](https://github.com/facebook/react-native/blob/master/react-native-cli/index.js)，详细模式运行npm在232行，
由源代码

```javascript
  var proc = spawn('npm', ['install', '--verbose', '--save', '--save-exact', getInstallPackage(rnPackage)], {stdio: 'inherit'});
```
修改为

```javascript
  var proc = spawn('npm', ['install','--registry=https://registry.npm.taobao.org', '--verbose', '--save', '--save-exact', getInstallPackage(rnPackage)], {stdio: 'inherit'});
```
正常模式运行npm在216行，
由源代码

```javascript
  exec('npm install --save --save-exact ' + getInstallPackage(rnPackage), function(e, stdout, stderr) {
```
修改为

```javascript
  exec('npm install --save --save-exact --registry=https://registry.npm.taobao.org ' + getInstallPackage(rnPackage), function(e, stdout, stderr) {

```

节约时间啊，亲。

