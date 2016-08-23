---
title: 加快create-react-app的下载速度
date: 2016-08-23 18:36:39
tags: Node.js
---

修改[create-react-app](https://github.com/facebookincubator/create-react-app)的安装源为[cnpm](https://cnpmjs.org/),加快下载速度.


 <!-- more -->


我们在命令行使用的[create-react-app my-app](https://github.com/facebookincubator/create-react-app/blob/master/README.md#tldr)是调用的package.json里面[bin的命令](https://github.com/facebookincubator/create-react-app/blob/master/global-cli/package.json#L17),当使用 npm install -g create-react-app 命令后，其实我们安装的的是一个cli工具，就是这个[index.js](https://github.com/facebookincubator/create-react-app/blob/master/global-cli/index.js)文件，注意这个js文件在首部添加了

``` bash
#!/usr/bin/env node
```

说明它已经是一个可执行文件。

当我们调用 create-react-app my-app 时，会先安装[react-scripts](https://www.npmjs.com/package/react-scripts)，见[134行](https://github.com/facebookincubator/create-react-app/blob/master/global-cli/index.js#L134)的

``` js
  var packageToInstall = 'react-scripts';
```

然后在[112行](https://github.com/facebookincubator/create-react-app/blob/master/global-cli/index.js#L112)进行 npm install的命令。

然后，程序执行[init函数](https://github.com/facebookincubator/create-react-app/blob/master/scripts/init.js),从[template目录](https://github.com/facebookincubator/create-react-app/tree/master/template)下的模板文件生成代码后，执行 [npm](https://github.com/facebookincubator/create-react-app/blob/master/scripts/init.js#L79)安装依赖。

因此，只要在inde.js的[106行](https://github.com/facebookincubator/create-react-app/blob/master/global-cli/index.js#L106)，init.js的[76行](https://github.com/facebookincubator/create-react-app/blob/master/scripts/init.js#L76)之后，添加

``` bash
--registry=https://registry.npm.taobao.org

```
即可.

由于react-scripts是在创建文件后运行的，这里无法通过修改registry的地址来加快下载速度，如果觉得从npmjs下载react-scripts的依赖很慢，可以直接ctrl+c退出node进程后，直接使用 cnpm i 就可以了
