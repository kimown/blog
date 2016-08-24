---
title: blog主题的修改内容
date: 2016-07-23 22:35:46
tags: Hexo
---

## 代码的[修改逻辑](https://github.com/kimown/blog/blob/master/themes/auto-update-theme-fs.js)

 <!-- more -->




- 2016-08-24 11:02
  - google公共库地址为[360CDN服务](http://libs.useso.com/),但不支持https，作罢
  - 修改google公共库地址为[科大加速服务](https://servers.ustclug.org/2014/06/blog-googlefonts-speedup/),修改文件：[head.ejs](https://github.com/hexojs/hexo-theme-landscape/blob/master/layout/_partial/head.ejs#L32),[after-footer.ejs](https://github.com/hexojs/hexo-theme-landscape/blob/master/layout/_partial/after-footer.ejs#L17)
  - 修改fontawesome-webfont[路径](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/_variables.styl#L29)为[cdn](http://www.bootcdn.cn/font-awesome/)，不走github pages

- 2016-08-23 22:24
  - 去除横幅背景图片，在[_variables.styl](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/_variables.styl#L39)去除


- 2016-08-24 21:01
  - 修改了landscape的背景色，在[_variables.styl](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/_variables.styl#L10),将背景色修改为[https://hexo.io/](https://hexo.io/)主页的颜色

``` Stylus
color-background = #eee

```
修改成
``` Stylus
color-background = #171f26
```

- 在[style.styl](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/style.styl#L65)去除背景色的赋值


　






