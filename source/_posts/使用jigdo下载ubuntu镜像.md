---
title: 使用jigdo下载ubuntu镜像
date: 2016-09-18 13:32:06
tags: Linux
---

 ubuntu14 ISO镜像的增量下载

 <!-- more -->

 今天在知乎上看到一篇[jigdo增量下载debian的文章](https://zhuanlan.zhihu.com/p/22383854)，当有老的ISO镜像时，增量下载可以大大的减少下载时间.

jigdo的[官方地址](http://atterer.org/jigdo/#how)，上面说支持debian和fedora,但是我想要下载的是ubuntu，而且[下载页面](http://mirrors.aliyun.com/ubuntu-releases/14.04.5/)也有.jigdo文件．

这里我用ubuntu-14.04.4-server-i386.iso和ubuntu-14.04.5-server-i386.iso为例,[下载地址].
可以看到，ubuntu-14.04.4-server-i386.iso 大小近583M,ubuntu-14.04.5-server-i386.iso近623M，两个镜像的.jigdo地址是：

http://mirrors.aliyun.com/ubuntu-releases/14.04/ubuntu-14.04.4-server-i386.jigdo
http://mirrors.aliyun.com/ubuntu-releases/14.04.5/ubuntu-14.04.5-server-i386.jigdo


## 安装jigdo

``` bash
https://help.ubuntu.com/community/JigdoDownloadHowto
jigdo-lite

```

下载完毕后，是这几个文件．
```
jigdo-file-cache.db  ubuntu-14.04.4-server-i386.iso.list  ubuntu-14.04.4-server-i386.iso.tmp  ubuntu-14.04.4-server-i386.jigdo  ubuntu-14.04.4-server-i386.template
```

恩，jigdo下载ubuntu后没有办法合并，下载失败了．

结论：ubuntu镜像还是使用老办法wget直接http下载吧，如果想要下载debian还是可以用一用jigdo的．






