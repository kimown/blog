---
title: 修改hexo主题landscape思路
date: 2016-08-24 20:07:36
tags: Node.js
---

 In all：描述下修改主题landscape文件的思路


 <!-- more -->

 和有后台的web不一样，静态博客的速度取决于网络、Github Pages托管的静态文件的加载速度，记得有个经典的题目关于在浏览器中输入url到呈现网页过程中发生了什么，quora上有一个[回答](https://www.quora.com/What-are-the-series-of-steps-that-happen-when-an-URL-is-requested-from-the-address-field-of-a-browser),大致流程都描述了出来,还有一篇更详细的[文章](http://fex.baidu.com/blog/2014/05/what-happen/) (擦，居然看到了R大)



 那么，按照quora的回答，优化静态博客的一些思路就显而易见了
 - url尽可能短
 - 预缓存dns查询结果，或者直接将修改hosts将域名和ip对应(本机环境)
 - 如果不考虑到可读性，html 、js、css 等静态资源进行压缩、合并处理
 - 考虑到[浏览器并发问题](https://www.zhihu.com/question/20474326),将和博客主体无关的其他资源放置在cdn服务器上，不会上传多余的cookie,但会多出额外的DNS解析时间
 - 使用https代替http
 - 清空无用的引入的文件，例如专注于写博客的话，其他所有和博客无关的东西都可以去除
 - 国内打开github有时会很慢，无解问题



这是之前修改landscape的[代码](https://github.com/kimown/blog/blob/d8e0a13f216495abb2a44c3433a6e72be0bb02ab/themes/auto-update-theme-fs.js),很槽糕的写法：代码重复度太高、可维护性极差、变量随意定义，只是单纯完成文件的替换功能，根本就没有考虑到以后扩展。

新的思路:

对于修改文件而言，主要两个参数：一是文件地址,统一下使用绝对路径，二是文件替换规则。替换规格可以利用string对象的[repalce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)方法，传入一个regexp或被替换的字符串，第二个参数可以是替换的字符串或函数。
但是对于一个文本文件而言，没有办法精确到某一行，还需要结合文件的[换行符](https://nodejs.org/dist/latest-v4.x/docs/api/os.html#os_os)找到指定行，然后在用正则替换，现在linux，mac下是'\n'，window下是'\r\n'，[详情](https://www.zhihu.com/question/46542168)

``` js
var a = [{
    filePath: '/tmp/a.js',
    rules: [{line: 'number', old: 'reg or substr', new: 'newSubStr'}]
}];
JSON.stringify(a,null,2);
```
[JSON.stringify格式化对象为字符串方法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_argument)


修改内容配置文件是类似下面格式的数据：
``` json
[
  {
    "filePath": "/tmp/a.js",
    "rules": [
      {
        "line": 233,
        "old": "reg or substr",
        "new": "newSubStr"
      }
    ]
  }
]
```


重构后的[代码地址](https://github.com/kimown/blog/blob/master/themes/auto-update-theme-fs.js) 。


这里没有使用[babel-register](https://babeljs.io/docs/usage/require/)，而是使用了bebel-node来启动，这样的话既可以使用es6或es7语法，很明显整个代码结构和之前相比清晰明了多了。

















