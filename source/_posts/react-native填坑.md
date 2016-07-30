---
title: react-native填坑
date: 2016-07-30 17:19:01
tags: React
---

记录下刚开始接触react-native遇到的一些问题

 <!-- more -->

## 网络问题

使用react-native-cli初始化AwesomeProject项目时，会使用npm安装第三方依赖，会从[npm官方](http://npmjs.com/)下载，这里我们改用[cnpm镜像](https://cnpmjs.org/).

``` bash
google@H:/tmp$ which react-native
/home/mdk/node/bin/react-native
google@H:/tmp$ ll /home/mdk/node/bin/react-native
lrwxrwxrwx 1 google google 45  6月 18 10:44 /home/mdk/node/bin/react-native -> ../lib/node_modules/react-native-cli/index.js*
google@H:/tmp$ cd /home/mdk/node/lib/node_modules/react-native-cli/
google@H:/home/mdk/node/lib/node_modules/react-native-cli$ l
index.js*  node_modules/  package.json  README.md
google@H:/home/mdk/node/lib/node_modules/react-native-cli$ vi index.js
```

这里看下react-native-cli代码，详细模式
运行npm在[232行](https://github.com/facebook/react-native/blob/master/react-native-cli/index.js#L232)，
由源代码

``` javascript
  var proc = spawn('npm', ['install', '--verbose', '--save', '--save-exact', getInstallPackage(rnPackage)], {stdio: 'inherit'});
```
修改为

``` javascript
  var proc = spawn('npm', ['install','--registry=https://registry.npm.taobao.org', '--verbose', '--save', '--save-exact', getInstallPackage(rnPackage)], {stdio: 'inherit'});
```
正常模式运行npm在[216行](https://github.com/facebook/react-native/blob/master/react-native-cli/index.js#L216)，
由源代码

``` javascript
  exec('npm install --save --save-exact ' + getInstallPackage(rnPackage), function(e, stdout, stderr) {
```
修改为

``` javascript
  exec('npm install --save --save-exact --registry=https://registry.npm.taobao.org ' + getInstallPackage(rnPackage), function(e, stdout, stderr) {

```



## null is not an object(evaluating 'this.state.showText')

虽然react hot实现了热更新，但是例如我在constructor中添加了一个state的属性值，保存后，页面热更新，会报上面的提示信息的错误。
原先：react-native的热更新无法替换整个state，无法实时反馈state的变化
解决方法：手动Reload页面


