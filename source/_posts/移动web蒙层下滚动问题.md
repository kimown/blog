---
title: 移动web蒙层下滚动问题
date: 2016-08-09 13:30:36
tags: web
---

移动web上，当页面弹出蒙层时，如果用户在蒙层上面滑动，会导致蒙层下面body的滚动，配合使用css和js解决问题。

<!-- more -->

先说下解决问题使用的关键词吧，移动web 蒙层 滚动 - Google Search,找到了
[javascript - 移动端禁止遮罩层以下屏幕滑动 - SegmentFault](https://segmentfault.com/q/1010000003075681)这篇文章，它直接给出了解决问题的思路。

>　
就让页面fixed住，然后在点击事件触发的时候获取window的offsetTop，然后设置成负值赋给页面元素



然后[这篇文章](http://www.jianshu.com/p/29d0fe0e7c4c)给出了使用overflow和position属性解决滑动问题，但是这里没有提到fixed属性会滑动到页面顶部的问题。

position fixed scroll to top - Google Search找到了[javascript - Prevent page scrolling to top upon adding fixed position - Stack Overflow](http://stackoverflow.com/questions/20230435/prevent-page-scrolling-to-top-upon-adding-fixed-position)
,最佳答案是使用top属性固定住页面的方法。

``` html
  <div class="main" style="position: fixed; top: -400px"></div>
```

最后的解决方案：
当用户点击按钮时，通过document.body.scrollTop属性获取当前页面滚动位置scrollTop，在body元素上将position置为fixed,overflow置为hidden,然后，将当前页面滚动位置scrollTop为负值赋给top属性，这样的话避免了页面滑动问题。
当用户点击蒙层时，取消原先给body的所有赋值，同时将页面滑动到原先的scrollTop位置上。

下面是[实例地址](http://sandbox.runjs.cn/show/lsyqlilo)，chrome快捷键CTRL+Shift+I打开mobile调试模式


代码:
``` javascript
function say_hello() {
    var scrollTop = window.document.body.scrollTop;
    layer.open({
        content: '可以尝试滑动蒙层，页面没有滚动',
        style: 'background-color:#09C1FF; color:#fff; border:none;',
        end: ()=> {
            $('body').css('overflow', '').css('position', '').css('top', '');
            window.document.body.scrollTop = scrollTop;
        },
        success: ()=> {
            $('body').css('overflow', 'hidden').css('position', 'fixed').css('top', -scrollTop);

        }

    });

}
```

EOF







