---
title: 译-一个有趣的JavaScript内存泄露情况
date: 2016-08-16 22:07:21
tags: 译
---

原文: http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak

    //TODO

 <!-- more -->

最近， Avi和David在追踪一个在Metror实时HTML模板渲染系统的内存泄露问题。这将会在0.6.5 release版本修复(现在QA的最后阶段)

我在网上用　javascript闭包内存泄露作为关键词搜索，结果没找到任何相关的信息，所以看起来是JavaScript上下文的一个相对少见的问题。(所能查找到的信息，大多关于在IE老版本中糟糕的GC算法，但是这个问题却影响我现在安装的所以Chrome浏览器)。
之后我找到了一个由V8开发者的[文章](http://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html),但看起来现在大部分JavaScript开发者并不知道他们需要小心这个问题。

JavaScript是一个函数编程语言，它的函数都是封闭的：函数对象可以接触到它们作用域里面的变量，即使这个作用域结束了。