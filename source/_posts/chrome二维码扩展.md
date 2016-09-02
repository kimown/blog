---
title: chrome二维码扩展
date: 2016-07-23 21:40:24
tags: Tool
---

　在做移动web开发的时候，经常有pc上启动前端服务，然后使用手机扫描二维码的要求。最初的时候，直接使用一些网站提供的二维码生成服务，后来这个方法太麻烦了，就在chrome商店里面找到二维码相关的扩展。

 <!-- more --> 
 
 但是之前的这个扩展，只能实现只展示当前页面URL二维码的功能，并不能提供自定义文字生成二维码的要求，搜了下，总觉得商店里面二维码的一些图标都不怎么好看，自己也懒得一个一个找，干脆自己做一个chrome扩展，一是练练手，二是熟悉下浏览器扩展，算是实现自己起初接触浏览器，自己想做一个浏览器扩展的想法吧。
　

　二维码的生成主要用到了[qrocejs](https://github.com/davidshimjs/qrcodejs),这里感谢作者提供这个很优秀二维码的js库，二维码的生成都是依靠它。
 
 　预览图：
　![preview](https://raw.githubusercontent.com/kimown/qrcodetools/master/resources/preview.gif)

　总结下，很大一部分时间都在阅读官方的[文档](https://developer.chrome.com/extensions)，不过感到很欣喜的是，文档描述，案例代码都很清晰简单，所以做这个小工具的时候基本没有遇到卡壳的时候，就是注册chrome扩展开发者的时候，需要信用卡，由于谷歌退出中国（⊙﹏⊙ｂ，什么时候回来啊）,没有国内银联卡的填写项，后来自己申请一个招行的全币种信用卡,扣了５美元，算是注册成功了。

 最后，顺便发下扩展的github地址: [qrcodeTools](https://github.com/kimown/qrcodetools)


 还有扩展商店安装地址 : [chrome webstore](https://chrome.google.com/webstore/detail/qr-code-tools/ocbhppgblkpojkpebamblimobggeaobi)
