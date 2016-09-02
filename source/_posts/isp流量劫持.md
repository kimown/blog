---
title: isp流量劫持
date: 2016-09-02 11:49:57
tags:
---


用chrome搜索关键字时时，经常出现这一种 Did you mean to got {http://**} 的提示，超级烦人。
![](https://cloud.githubusercontent.com/assets/7932380/18192123/c90a387e-7103-11e6-80c4-d68ceb5e23ec.png)

![](https://cloud.githubusercontent.com/assets/7932380/18192171/62fab40e-7104-11e6-9a82-942ff9863cfe.png)


具体的现象是：在chrome搜索框输入关键字后，搜索框有一端莫名奇妙的提示，点击提示链接后，有很明显的页面跳转行为，然后重定向到一个 悠悠导航 的网站
![](https://cloud.githubusercontent.com/assets/7932380/18192193/a3f87928-7104-11e6-96a1-26432cfddf0c.png)


根据[quora](https://www.quora.com/How-can-I-get-Chrome-to-stop-asking-Did-you-mean-to-go-to)和[google论坛](https://productforums.google.com/forum/#!topic/chrome/LGepU6tPPWs)的两篇讨论的内容，
当我搜索 lookup 这个关键词后，chrome会对这个关键字进行以此dns查询。但是，ips运营商会为了展示自定义的错误页面或者广告页面，会返回一个统一的错误的地址。我们使用Node.js的dns模块可以看到错误地址的具体ip。

``` js
const dns = require('dns');

dns.lookup('lookup', (err, addresses, family) => {
    console.log('addresses:', addresses);
```
![](https://cloud.githubusercontent.com/assets/7932380/18192466/10c57022-7107-11e6-9d40-44c96cd0d14d.png)，从查询结果我们可以看到返回的ip地址是 202.102.110.203 ，当点击 Did you mean to got {http://**} 里面的具体链接后，
chrome会直接访问这个ip地址，对应上面代码里面dns lookup的查询结果。（但是这个具体的域名 http://look/ 怎么出来的，没搞清楚，但应该是和ip地址一起返回的？？）

![](https://cloud.githubusercontent.com/assets/7932380/18192500/7507f5fa-7107-11e6-83d6-d8c701aa0984.png),看下响应里面的代码,恩，做了代码压缩,一些js方法的使用值得学习下。
``` html
<html><head></head><script type="text/javascript">
var sa = "http://202.102.110.207:8080/"; var pp = "108&pre="+(new Date()).getTime();
var s=String(window.location.href); var host=escape(s.substring(7,s.indexOf('/',7)));
var ref=escape(document.referrer); var su = s+"&host="+host+"&refer="+ref+"&server="+pp;
s = escape(s); function loadfr(){ document.getElementById("fr1").src = sa+"3.htm?AIMT="+su; }
function refreshPage(){ document.location = sa+"2.htm?AIMT="+su; }
if (self.location == top.location){ document.location= sa+"1.htm?AIMT="+su; }
else { refreshPage(); }</script><frameset rows="*,0"><frame id="main" src="">
<frame id="fr1" src=""></frameset><body></body></html>
```
![](https://cloud.githubusercontent.com/assets/7932380/18192580/2aa62260-7108-11e6-97b6-40c52b4d1e82.png)

代码里面有一个refreshPage方法，意思是如果是内嵌iframe类型的，会跳转到另外的一个地址，不过这种类型的跳转没见过，不知道在哪种场景会用到。


最后跳转的是类似 http://202.102.110.207:8080/1.htm?AIMT=http://look/&host=look&refer=&server=108&pre=1472787468116 这样的地址，用postman看下响应，

![](https://cloud.githubusercontent.com/assets/7932380/18192973/9e289fc6-710b-11e6-81d6-cca098a679d5.png).

用curl模拟下浏览器行为，此时后台根据不同请求来源输出不同的响应，这里是302暂时重定向，最终指向的不是长长的带有ip地址的url，而是直接 悠悠导航 的域名。

![](https://cloud.githubusercontent.com/assets/7932380/18193238/2953c7fe-710e-11e6-82de-fd466a514757.png)
 就是上面看到的 悠悠导航。



 有个问题也没有搞清楚：
 - http://look/ 是怎么出来的



最终的解决方案，修改本机的dns，[修改方法](https://developers.google.com/speed/public-dns/docs/using?csw=1)，其实最好的方法是直接投诉运营商。







