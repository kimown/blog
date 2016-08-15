---
title: [译]理解GC，解决Node.js内存泄露问题
date: 2016-08-14 21:42:38
tags: 译
---

原文: http://apmblog.dynatrace.com/2015/11/04/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js

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

我们都知道


作为一个程序员有必要是放掉不再使用的堆内存.如果一个程序一直分配内存，但却不释放，堆内存会一致增长知道可用的内存被消耗殆尽，引起程序崩溃。我们称之为内存泄露。

在上文我们谈到，在Node.js中，Ｖ8会将JavaScript编译成机器码，编译出来的机器码的数据结构和它们起初的表示没有什么关系，并且这些机器码都是完全由V8管理。
这就是在JavaScript中我们不能主动分配、释放内存的原因。V8使用一个广为人知的机制来解决这个问题：垃圾回收。

GC背后的理论十分简单：如果一个内存块不再被任何地方引用，我们就可以假设它不再使用，因此可以被释放掉。但是，检索和维护这些信息却十分复杂，因为实际情况下，它可能是
链式引用，或者从一个复杂的图形结构间接引用。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/memory_graph.png)
> 堆图。只有当红色对象没有任何引用时，它才可以被释放

GC是相当昂贵的进程，因为它会中断程序的执行，自然的这会影响程序性能。为了改善这个情况，V8使用了两种不同的GC策略：
(PS:这里可参考朴灵大大的《深入浅出Node.js》第05章：内存控制)

* Scavenge ，速度快，但不完全
*　Mark-Sweep，相对慢，但是会释放掉所有没有引用的内存

一个非常精彩的关于V8 GC的信息，[点击这里](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection)

再次查看我们从process.memoryUsage() 收集到的数据，我们可以很清晰的辨别出不同的GC策略：锯齿状的模式是由Scavenge运行产生的，断崖式的下降是由Mark-Sweep运行产生的。

通过使用原生模块[node-gc-profiler](https://github.com/bretcope/node-gc-profiler)我们可以收集到更多关于GC运行的消息。这个模块会订阅V8触发的GC事件，然后将
这些信息暴漏给JavaScript.

这些返回的对象会显示GC类型和时间。同样，我们可以很容易将这些信息转化为图形，来更好的理解V8怎么工作的。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_5-1024x463.png)
> GC运行的持续时间和频率

我们可以看到Scavenge远比Mark-Sweep运行更频繁。取决于程序的复杂度，持续时间也会发生变化。有趣的是，上面的图表页展示了 Mark-Sweep运行频繁，时间相对简短，这个功能是我之前没有
发现的。

## 当糟糕的事情发生后

如果GC清理内存，是不是意味着我们根本不用关心内存的使用?实际上，仍然可能，并且很简单就可以模拟在你的日志中发生出现的内存泄露现象。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_6-1024x476.png)
> 内存泄露引起的异常

引用我们之前介绍的图表，我们可以看到内存使用在在不断上升

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_7-1024x524.png)
> 在程序中的内存泄露情况

GC每次运行时，会尽可能的释放掉内存，但是每次GC运行后，我们可以看到内存使用还在持续上升，这是内存泄露的显著标志。这些指标都是异常检测的一个很好出发点，
在讨论怎么追踪内存泄露的问题，首先让我们回顾下怎么构造出内存泄露。


## 构造泄露

一些泄露情况是很显而易见的，例如在进程的全局变量上存储数据，一个简单的例子是在一个数组中存储每次访问者的IP地址。而其他的一些问题更狡猾，例如著名的
[ Walmart memory leak](https://www.joyent.com/blog/walmart-node-js-memory-leak),它是由于在Node.js核心代码里面缺失语句导致的，然后花费了数周的时间
来追踪它。

我不想在这里谈论核心代码的错误。相反，让我们一个在你自己JavaScript代码里很容易复现但是很难追踪的内存泄露问题，这是我在[Meteor’s blog](http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak)
找到的。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_8-1024x631.png)
> 在你自己的代码中重现泄露问题

第一眼看来，代码都是OK的。