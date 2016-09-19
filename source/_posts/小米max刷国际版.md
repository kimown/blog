---
title: 小米max刷国际版
date: 2016-09-16 12:01:12
tags: Life
---

MIUI外号ADUI，小米max到手的第一件事刷国际版MIUI,毕竟外国的MIUI比较圆．

 <!-- more -->


- [申请解锁](http://www.miui.com/unlock/),审核成功后会有短信通知
- [由稳定版卡刷MIUI开发板](http://www.miui.com/download-315.html)，[教程](http://www.miui.com/shuaji-329.html)
- [Fastboot解锁](http://www.miui.com/thread-3367802-1-1.html),注意要先安装[小米助手](http://zhushou.xiaomi.com/)，否则解锁工具不识别手机,还有手机上要登陆小米账号
- 安全中心开启root权限
- 下载[国际版ROM包](http://en.miui.com/download-302.html),放到内置存储卡
-　安装[Flashify](http://www.miui.com/thread-4939281-1-1.html)，音量键+&电源键进入 TWRP界面
-　双清后安装zip包，重启，如果页面一直是loading状态，在重启一次，然后显示安装的进度条
-　当进度条到顶时，ok

- 下面在刷[TWRP](http://en.miui.com/thread-293031-1-1.html),整体思路来自这篇[回复](http://en.miui.com/thread-287609-1-1.html)
-
-
-
-
-
-


References:
- http://www.miui.com/thread-4939281-1-1.html
- http://bbs.xiaomi.cn/t-12334298
- http://www.miui.com/thread-4324518-1-1.html
- http://stackoverflow.com/questions/27017453/fastboot-and-adb-not-working-with-sudo
- https://securitycafe.ro/2014/12/16/how-to-install-android-5-0-1-lollipop-on-samsung-galaxy-s4/


```
sudo $(which fastboot) devices
sudo $(which fastboot) flash recovery recovery.img

sudo $(which fastboot) boot recovery.img

```













