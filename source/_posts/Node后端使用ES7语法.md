---
title: Node后端使用ES7语法
date: 2016-09-13 19:43:54
tags: Node.js
---

前端由于webpack和babel的结合使用，已经可以广泛的使用最新的[ES6](https://babeljs.io/docs/learn-es2015/)和[ES7](http://babeljs.io/docs/plugins/preset-es2017/)特性，但是在服务器端，当然可以编写ES6语法,然后通过打包代码到ES5的方式来运行，但是这样做的话会出现问题debug会很麻烦。


 <!-- more -->



 ## babel-node

 之前看过f8app导入[mongodb数据库](https://github.com/fbsamples/f8app/blob/master/scripts/import-data-from-parse.js)的小脚本，里面使用了await和async语法，其实最终是通过使用了[babel-node](https://babeljs.io/docs/usage/cli/)启动的，但是官方也说明了内存占用高，不适合用于生产环境，但是写写小程序的话极为方便。


 在[babel v6.14.0](https://github.com/babel/babel/releases/tag/v6.14.0)中,出现了一个新的preset:[babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/),可以解析ES2015, ES2016, ES2017语法，真的是很方便的一个包。

这是babel的使用[教程](http://babeljs.io/docs/plugins/preset-latest/),我就用fs模块写了一个小[demo](https://github.com/kimown/gist/tree/master/babel-present-latest/babel-node);



由于我使用的是alinode,所以这里还需要给node做一个软链接，否则会报错: /usr/bin/env: node: No such file or directory,解决方法是[给alinode做一个软连接](http://stackoverflow.com/questions/30281057/node-forever-usr-bin-env-node-no-such-file-or-directory)。
``` js
sudo ln -s "$(which nodejs)" /usr/bin/node
```
注意这里是双引号，在bash里面单引号和双引号还是有区别的．

现在说下babel-node结合WebStorm进行断点调试的功能，我现在WebStorm的版本是2016.2.2。我的建议是全局安装babel-cli,
 ``` bash
 npm install --global babel-cli
 ```

然后让Node interpreter:　指向全局安装的babel-node的位置：~/.tnvm/versions/alinode/v1.6.0/lib/node_modules/babel-cli/bin/babel-node.js　，然后右键，Debug '${File Name}'　即可。如果全部安装的babel-node的版本和package.json里面的babel-node的版本不一致，那就把Node interpreter: 的路径指向node_modules里面 ${ProjectPath}/node_modules/babel-cli/bin/babel-node.js 的位置。


 ## require-hook

  另外一种是使用babel提供的require-hook方法，源于我在stackoverflow看到的[一篇回复](http://stackoverflow.com/questions/29170589/debug-nodejs-es6-app-webstorm)，里面介绍使用引入 'babel/register'这个库来debug程序,这篇回复的日期是15年3月份，现在babel官方已经使用babel-register这个新的库来代替，只能说前端发展太迅速了，很多学习的内容转眼间就outdated。

  整体思路来自于[这篇回复](http://stackoverflow.com/a/35002082/5074324)，但是这个回复不怎么简洁，自己又重新组织了下代码，上面一样又是一个fs的小[demo](https://github.com/kimown/gist/tree/master/babel-present-latest/babel-register)



这篇文章的核心全部在上面两个小demo上，以上，EOF









