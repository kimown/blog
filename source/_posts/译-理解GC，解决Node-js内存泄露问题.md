---
title: [译]理解GC，解决Node.js内存泄露问题
date: 2016-08-14 21:42:38
tags: 译
---

原文: http://apmblog.dynatrace.com/2015/11/04/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/

    //TODO
  <!-- more -->

无论何时Node.js总有一个负面报道，通常是它的性能问题。但并不意味着相比于其他技术，Node.js更容易产生问题，而是作为一个开发者，我们需要了解Node.js是怎么工作的。
虽然相关技术有十分简单的平滑学习曲线，但是使Node.js运转的机器却十分复杂，你必须提前了解这些内容以避免踏入性能陷阱。如果，使用Node.js过程中发生了什么问题，你
需要知道怎样迅速的解决它。

在这篇文章中，我将要介绍Node.js怎样管理内存，怎样追踪定位内存相关问题。和其他类似PHP的平台不同，Node.js应用是长时间运行的线程。当然这个特性拥有很多好的方面，
例如只建立一次数据库连接，然后在所有的请求里面复用，当然这样可能会引起其他问题。但是首先，它包含了Node.js的一些基础知识。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_1.png)
> 一个在澳大利亚的垃圾收集车

## Node.js是被V8控制的C++程序
[Google V8](https://developers.google.com/v8/)起初是用于Google Chrome的JavaScript引擎，但是它也可以独立使用。这使得V8特别适用于Node.js，并且成为
Node.js平台上唯一深层次理解JavaScript的部分。V8将JavaScript编译机器码后执行。执行期间，V8会分配和释放不必要的内存。这就是如果我们讨论Node.js中的内存管理，那
就是我们在讨论V8的原因。

请阅读[这篇文章](https://developers.google.com/v8/get_started)的一个从C++角度怎样使用V8的案例，

## V8的内存模式
一个运行中的程序总是通过分配在内存里面空间表示的。这个空间称为*Resident Set*(实际使用物理内存).V8使用了类似Java虚拟机的相同的模式，那就是将内存分代。

* 代码:执行的实际代码
* 栈：包含所有的数据类型（类似整型integer和布尔型Boolean的基本类型），以及在堆里面对象的指针引用，还有程序控制流的指针定义
* 堆：一个被用于存储引用类型，例如对象objects，字符串strings和闭包的内存块

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_2.png)
> V8的内存模式

在Node.js里面，可以调用[process.memoryUsage()](https://nodejs.org/api/process.html#process_process_memoryusage)方法，简单的查询内存使用情况。

这个函数会返回一个对象，包含:
* Resident Set Size 　　　　　　实际使用物理内存
* Total Size of the Heap　　　　所有的堆内存
* Heap actually Used　　　　　　已使用的堆内存

我们可以使用这个函数来间断的记录内存使用情况，然后创建一个图表，来很完美的展示V8的内存管理是怎么工作的

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_32.png)
> 过去一段时间Node.js的内存管理情况

我们可以看到，已使用堆内存是高频不确定的，但是始终维持着一个恒定的界线，来保证平均值是一个常量。这个分配、释放堆内存的机制称之为*garbage collection*(垃圾回收).

## 深入垃圾回收

所有程序都会使用内存，这就需要一个保存和释放内存的机制。在C和C++中,例如下面的例子所展示的，是通过*malloc()*和*free()*函数来实现的。





