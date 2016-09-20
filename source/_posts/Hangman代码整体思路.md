---
title: Hangman代码整体思路
date: 2016-09-18 18:48:58
tags: Node.js
---

 题目地址是[这里](https://github.com/strikingly/strikingly-interview-test-instructions),大意是通过一个RESTful接口进行猜词．

  <!-- more -->


这里我对[当前最新的commit进行分析](https://github.com/kimown/gist/tree/0aa59b271110e792bfd34fe8e6ee8a60eae3792a/hangman-game)，以后的代码结构有可能会变化


## 代码思路
使用一个单词字典，首先根据长度过滤单词，找到出现频率(一个单词内重复字符只计数一次)最高的字符，如果字符猜测正确，根据已知的字符过滤下单词字典，如果字符猜测错误，排除掉所有含有错误字符的单词， 然后重新统计单词字典中字符的频率,如果发送次数大于20次，下一个单词；如果错误次数超过限定值，下一个单词.

## 注意点:
- ### 英文字典的选取：
起初我使用的是一个[1M大的小字典](http://www-01.sil.org/linguistics/wordlists/english/),还有[这个](http://www-personal.umich.edu/~jlawler/wordlist),但后来发现一个情况，有一个单词10个字符已经猜中了9个，还有最后一个字符迟迟猜不中，后来直接google查了下类似的单词，只找到一个对应的，在小词典里面根本没有这个单词，于是只能换一个更大的[词典](http://stackoverflow.com/questions/6441975/where-can-i-download-english-dictionary-database-in-a-text-fomat),而且，这个词典里面还有一些单词格式不符合常见的格式，所以我按照字符过滤了下，[过滤规则](https://github.com/kimown/gist/blob/0aa59b271110e792bfd34fe8e6ee8a60eae3792a/hangman-game/common/scripts.js#L36)是两个，分别是过滤含有非大小写字符的单词和类似"AAA"或"aaaa"这种由相同字符组成的单词，这里使用正则过滤，如果使用字符串比较的话效率非常非常低，而且循环比较的时候程序很容易异常退出．

- ### 分数的考虑
因为是对抗游戏，所以[游戏分数](https://github.com/strikingly/strikingly-interview-test-instructions#5-submit-your-result)当然越高越好,计分规格：correctWordCount\*20-totalWrongGuessCount\*1.猜对一个单词，得分20,猜错一次字符，扣1分．这个得分规则决定了一个单词的收益最高20,那么限制一个单词的猜词次数不能超过20次是一个理想的选择（最坏情况：kimow* 最后一个字符n是最后一次猜对的，单词收益-1），否则直接跳过这个单词，进行下一轮．




## 代码整体结构:

## Dependencies

- [pm2](https://github.com/Unitech/pm2)     #确保程序24*7运行
- [babel-register](https://github.com/babel/babel/blob/master/packages/babel-register/README.md)    ＃在后端使用最新ES语法
- [request](https://github.com/request/request)     #向后台发送POST请求
- [winston](https://github.com/winstonjs/winston)   #统一的日志库


``` bash
$ tree -L 1
.
├── babel-present-latest #项目无关
├── created-logfile.log #记录了当前游戏的日志,这次猜词结果是成功还是失败，添加到.gitignore里面，不纳入git管理
├── created-logfile-score.log #记录了所有游戏最后的分数
├── hangman-game  #游戏代码
├── LICENSE
├── loggerfile.js #输出日志到文件
├── logger.js #对外console输出日志 #在游戏里面，每次猜测的字符都会从这里输出到console台里面
├── node_modules
├── package.json
├── tmp
└── util.js　#工具方法

```
[created-logfile-score.log](https://github.com/kimown/gist/blob/0aa59b271110e792bfd34fe8e6ee8a60eae3792a/created-logfile-score.log):可以看到所有的得分，这样可以后台24*7刷分，最后到这个文件里面找到分数最高的就可以了
util.js : 为了保证项目代码的对依赖的便于替换，使用到的第三方依赖都是统一在[util.js](https://github.com/kimown/gist/blob/0aa59b271110e792bfd34fe8e6ee8a60eae3792a/util.js)这个工具类方法里面使用的，然后暴露对外的使用方法．例如我日志库不想使用winston而想使用[log4js](https://github.com/nomiddlename/log4js-node)，那么只需要在这里替换对应的库就可以了．想了下，这里如果封装自己的方法可以更好，这算是个优化点．


``` bash
$ tree /tmp/gist/hangman-game/
├── app.js　　#主程序
├── common
│   ├── config.json　#配置文件
│   ├── config-path.js　#将通用的路径统一暴露出去，便于维护
│   ├── index.js  #对外暴露的公共方法
│   ├── init-user-data.js #初始化用户数据，包括读取字典文件，参考flux架构起到只有一个store的作用
│   ├── operate-user-data.js　#对用户数据的读写操作
│   ├── script_index.js
│   └── scripts.js
├── enwiktionary-latest-all-titles-in-ns0
├── enwiktionary-latest-all-titles-in-ns0-filter.txt  #字典文件
├── index.js　　#使用babel-register启动的入口文件
├── package.json
└── README.md

1 directory, 13 files
```
script_index.js和scripts.js：是工具文件，对原始文件enwiktionary-latest-all-titles-in-ns0操作后，生成最后读取的enwiktionary-latest-all-titles-in-ns0-filter.txt字典文件，和主程序无关．





