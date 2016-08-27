---
title: reinstall ubuntu14,配置环境
date: 2016-08-27 13:56:15
tags: Linux
---

//TODO

 <!-- more -->


昨天看到了深度看图V1.0，看样子linux下能看的软件又多了一个，由于深度没有提供二进制包，只能自己源码安装，结果被那复杂的依赖关系搞蒙了头，装了它的一堆依赖，结果还是报错，怒摔键盘，不想浪费时间折腾它了。结果今天早上一起来，开机后，发现触摸板失灵，情况是鼠标只悬浮在桌面中央，无论怎么操作都不能移动。网上搜了一堆资料，无果。只能重装下ubuntu系统。


## tmux


## vim
``` bash
sudo apt-get install vim
```

## 修改源地址

``` bash
sudo mv /etc/apt/sources.list /etc/apt/sources.list.old
sudo touch /etc/apt/sources.list
 vi /etc/apt/sources.list
```

填入下面内容


``` bash
  deb http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse
  deb http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse
  deb http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse
  deb http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse
  deb http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse
  deb-src http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse
  deb-src http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse
  deb-src http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse
  deb-src http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse
  deb-src http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse

```


后执行   sudo apt-get update

## alinode cnpm

## hexo

## 搜狗输入法

## chrome

## 网易云音乐

## webstorm  idea

## vmware安装osx虚拟机








