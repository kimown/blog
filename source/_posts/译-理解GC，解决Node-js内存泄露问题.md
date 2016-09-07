---
title: 译:理解GC，解决Node.js内存泄露问题
date: 2016-08-14 21:42:38
tags: 译
---

原文: http://apmblog.dynatrace.com/2015/11/04/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js

    //TODO

 <!-- more -->

无论何时Node.js总有一个负面新闻，通常与Node.js的性能问题有关。这不意味着和其他技术相比，Node.js更容易产生问题，作为一个开发者，我们必须要知道Node.js是怎么工作的。
虽然Node.js的相关技术有十分平滑的学习曲线，但是使Node.js运转的机器却十分复杂，你必须提前了解这些内容以避免踏入性能陷阱。如果使用Node.js的过程中发生了问题，你需要知道怎样迅速的解决它。

在这篇文章中，我将要介绍Node.js怎样管理内存，怎样追踪定位内存相关问题。和其他类似PHP的平台不同，Node.js应用是长时间运行的线程。当然这个特性拥有很多优点，例如只建立一次数据库连接，然后在之后所有的请求里面复用，当然这样可能会引起其他问题。但是首先，让我们介绍一些Node.js的基础知识。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_1.png)
> 一个在奥地利的垃圾收集车

## Node.js是被V8控制的C++程序
[Google V8](https://developers.google.com/v8/)起初是用于Google Chrome的JavaScript引擎，但是它也可以独立使用。这使得V8特别适合用于Node.js，并且成为Node.js平台上唯一深入理解JavaScript的一部分。V8将JavaScript编译机器码后执行。执行期间，V8会分配和释放不必要的内存。这意味着如果我们讨论Node.js中的内存管理，那就是我们在讨论V8的原因。

请阅读[这篇文章](https://developers.google.com/v8/get_started)，里面包含了一个从C++角度怎样使用V8的案例，

## V8的内存模式
一个运行中的程序总是通过分配在内存里面空间表现的。这个空间称为*Resident Set*(实际使用物理内存).V8使用了类似Java虚拟机的相同的模式，那就是将内存分代。

* 代码:执行的实际代码
* 栈：包含所有的数据类型（例如整型integer和布尔型Boolean等基本类型），以及指向堆内对象的指针，还有定义程序控制流的指针
* 堆：一个被用于存储引用类型，例如对象objects，字符串strings和闭包closures的内存块

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_2.png)
> V8的内存模式

在Node.js里面，可以很轻易的调用[process.memoryUsage()](https://nodejs.org/api/process.html#process_process_memoryusage)方法来查询内存使用情况。

这个函数会返回一个对象，包含:
* Resident Set Size 　　　　　　实际使用物理内存
* Total Size of the Heap　　　　所有的堆内存
* Heap actually Used　　　　　已使用的堆内存

我们可以使用这个函数来记录内存的使用情况，然后创建一个图表，很完美的展示V8的内存管理是怎么工作的

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_32.png)
> 过去一段时间Node.js的内存管理情况

我们可以看到，已使用堆内存是很不确定的，但是始终维持着一个恒定的界线，来保证平均值是一个常量。这个分配、释放堆内存的机制称之为*garbage collection*(垃圾回收).

## 深入垃圾回收

所有程序都会使用内存，这就需要一个保存和释放内存的机制。在C和C++中,例如下面的例子所展示的，是通过*malloc()*和*free()*函数来实现的。

我们都知道作为一个程序员，有必要是释放不再使用的堆内存.如果一个程序一直分配内存，但却不释放，堆内存会一直增长，直到可用的内存被消耗殆尽，引起程序崩溃。我们称之为内存泄露。

在上文我们谈到，在Node.js中，V8会将JavaScript编译成机器码，编译出来的机器码的数据结构和它的原始表达语句没有什么关系，并且这些机器码完全是由V8管理的。
这就是在JavaScript中我们不能主动分配、释放内存的原因。V8使用一个广为人知的机制来解决这个问题：垃圾回收。

GC背后的理论十分简单：如果一个内存块不再被任何地方引用，我们就可以假设它不会被使用，因此可以被释放掉。但是，检索和维护这些信息却十分复杂，因为实际情况下，它可能是链式引用，或者从一个复杂的图形结构间接引用。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/memory_graph.png)
> 堆图。只有当红色对象没有任何引用时，它才可以被释放

GC是相当昂贵的过程，因为它会中断程序的执行，自然而然的这会影响到程序性能。为了改善这个情况，V8使用了两种不同的GC策略：
(PS:这里可参考朴灵大大的《深入浅出Node.js》第05章：内存控制)

* Scavenge ，速度快，但不完全
* Mark-Sweep，相对慢，但是会释放掉所有没有引用的内存

一个非常精彩的关于V8 GC的信息，[点击这里](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection)

再次查看我们从process.memoryUsage() 收集到的数据，我们可以很清晰的辨别出不同的GC策略：锯齿状的模式是由Scavenge运行产生的，断崖式的下降是由Mark-Sweep运行产生的。

通过使用原生模块[node-gc-profiler](https://github.com/bretcope/node-gc-profiler)我们可以收集到更多关于GC运行的消息。这个模块会订阅V8触发GC的事件，然后将这些信息暴露给JavaScript.

返回的对象会显示GC类型和持续时间。同样，我们可以很容易将这些信息用图表表示，来更好的理解V8怎么工作的。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_5-1024x463.png)
> GC运行的持续时间和频率

我们可以看到Scavenge Compact比Mark-Sweep运行更频繁。取决于程序的复杂度，持续时间也会发生变化。有趣的是，上面的图表也展示了 Mark-Sweep运行频繁，时间相对简短，这个功能是我之前没有确定的。

## 当糟糕的事情发生后

如果GC清理内存，是不是意味着我们根本不用关心内存的使用?实际上，仍然可能并且很简单的就可以模拟在你的日志突然发生的内存泄露现象。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_6-1024x476.png)
> 内存泄露引起的异常

引用我们之前介绍的图表，我们可以看到内存使用在在不断上升

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_7-1024x524.png)
> 在程序中的内存泄露情况

GC每次运行时，会尽可能的释放掉内存，但是每次GC运行后，我们可以看到内存使用还在持续上升，这是内存泄露的显著标志。这些指标都是异常检测的一个很好的起点，在讨论怎么追踪内存泄露的问题，首先让我们回顾下怎么构造出内存泄露。


## 构造泄露

一些泄露情况是很显而易见的，例如在进程的全局变量上存储数据，一个简单的例子是在一个数组中存储每次访问者的IP地址。而其他的一些问题更隐蔽，例如著名的[ Walmart memory leak](https://www.joyent.com/blog/walmart-node-js-memory-leak),它是由于在Node.js核心代码里面缺失语句导致的，然后花费了数周的时间来追踪它。

我不想在这里谈论核心代码的错误。相反，让我们构造一个在你自己JavaScript代码里很容易复现但是很难追踪的内存泄露问题，这是我在[Meteor’s blog](http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak)找到的。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_8-1024x631.png)
> 在你自己的代码中重现泄露问题

第一眼看来，代码都是OK的。我们都认为每次调用replaceThing方法，theThing这个变量都会被覆盖。问题是someMethod方法拥有自己的作用域作为上下文。这意味着unused()方法在someMethod()内部是可以访问的，尽管unused()方法没有被调用，但是它
阻止了GC回收originalThing对象。这里由于有太多间接引用，很难定位查找问题。这并不是一个bug,但是它会造成一个难以追查的内存泄露问题。

所以，如果我们可以深入了解到堆里面的情况就好了？幸运的是，可以。V8提供了一个导出堆情况的方法，V8-profiler把这个功能暴露给了JavaScript.

这个简单的模块在内存使用持续上升的情况下导出堆快照。当然，还有一些其他复杂的方法来侦测异常情况，但是，从我们的目的而言，它已经足够了。如果有一次内存泄露，你最后会有多个这样的快照文件。所以你需要仔细监测这些，并给这些模块添加一些警报功能。chrome同样带有分析堆快照的功能，
你可以使用chrome开发者工具分析V8。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_91-1024x670.png)
> Chrome开发者工具

一个堆快照文件并不一定能帮助到你，因为它不能随时间变化展示堆的变化情况。这就是chrome开发者工具允许你比较不同堆快照的原因。通过比较两个堆快照，我们可以找到哪种结构在增长。

![](http://apmblog.dynatrace.com/wp-content/uploads/2015/11/DK_10-1024x679.png)
> 堆快照的比较展示了内存泄露

这里我们遇到了一个问题。一个叫longStr的变量包含了一大串星号，它被originalThing引用，originalThing被一些方法引用，这个方法又被....引用。好吧，明白了，这个很长路径的嵌套引用和闭包作用域阻止了longStr被垃圾回收。


1.定时创建一些堆文件，期间要有内存的分配
2.比较一些快照文件，找到是什么在增长