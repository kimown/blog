---
title: blog主题的修改内容
date: 2016-07-23 22:35:46
tags: Hexo
---

## 代码的修改逻辑[here](https://github.com/kimown/blog/blob/master/themes/auto-update-theme-fs.js)

 <!-- more -->

- 修改了landscape的背景色，在[_variables.styl](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/_variables.styl#L10)
将背景色修改为[https://hexo.io/](https://hexo.io/)主页的颜色

``` Stylus
color-background = #eee

```
修改成
``` Stylus
color-background = #171f26
```

- 在[style.styl](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/style.styl#L65)去除背景色的赋值

- 去除横幅背景图片，在[_variables.styl](https://github.com/hexojs/hexo-theme-landscape/blob/master/source/css/_variables.styl#L39)去除

　






