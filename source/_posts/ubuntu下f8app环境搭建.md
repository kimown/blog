---
title: ubuntu下f8app环境搭建
date: 2016-08-07 14:29:33
tags: React
---


　完成f8app　ubuntu14.04下的环境搭建

 <!-- more -->

## 安装MongoDB

 官方文档[地址](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition)

``` bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
```

f8app [README.MD]() 使用下面的命令检查mongo进程是否存在

```　bash
lsof -iTCP:27017 -sTCP:LISTEN　　//或者
lsof -i:27017
ps -ax | grep mongo
```

如果不是在root用户下，这些命令使无法看到mongo进程的.原因:
[Not all processes could be identified, non-owned process info will not be shown, you would have to be root to see it all.](http://askubuntu.com/questions/696395/how-to-find-out-on-which-port-mongo-is
)

idea系列中自带了对db的支持，但是很遗憾这个功能没有引入webstrom中，因此我们需要装一个webstorm的[插件](https://plugins.jetbrains.com/plugin/7141)

``` bash　
google@H:/usr/bin$ ps -ax|grep mongo
 2579 pts/38   S+     0:00 grep --color=auto mongo
32022 ?        Ssl    0:07 /usr/bin/mongod --config /etc/mongod.conf
```

查看下mongo的安装目录，在/usr/bin/mongod目录下，将路径/usr/bin/mongod输入到Path to Mongo Shell，点击Test。
![SUCCESS](https://cloud.githubusercontent.com/assets/7932380/17461133/c2424ba8-5cb3-11e6-8b13-e3a53836677e.png)

至此，mongodb的安装完结,下面转到[README.md上面](https://github.com/fbsamples/f8app)

## 导入数据到mongodb


导入前：
  * Parse Dashboard: [http://localhost:8080/dashboard](http://localhost:8080/dashboard)
  * Graph*i*QL: [http://localhost:8080/graphql](http://localhost:8080/graphql?query=query+%7B%0A++schedule+%7B%0A++++title%0A++++speakers+%7B%0A++++++name%0A++++++title%0A++++%7D%0A++++location+%7B%0A++++++name%0A++++%7D%0A++%7D%0A%7D)

数据库表：
![before](https://cloud.githubusercontent.com/assets/7932380/17461206/10f4487a-5cb7-11e6-974b-a413fffe7820.png)
Dashboard:
![before](https://cloud.githubusercontent.com/assets/7932380/17461220/b1018828-5cb7-11e6-966d-65698c998697.png)
GraphiQL:
![before](https://cloud.githubusercontent.com/assets/7932380/17461233/04d5ffa6-5cb8-11e6-85fb-5de57af3e4ad.png)

导入后
![after](https://cloud.githubusercontent.com/assets/7932380/17461208/288b74ea-5cb7-11e6-966e-ad075f5f7730.png)
Dashboard:
![after](https://cloud.githubusercontent.com/assets/7932380/17461222/b9d47fa0-5cb7-11e6-80a5-91547ef9440f.png)
GraphiQL:
![before](https://cloud.githubusercontent.com/assets/7932380/17461234/06137736-5cb8-11e6-85f7-f43060726a6b.png)

这些只要运行 npm run import-data　这个命令就可以了，注意：
执行命令后如果一直卡在Loading Speakers，需要[重新运行　npm start　命令](https://github.com/fbsamples/f8app/issues/4#issuecomment-209906785)，注意下端口占用问题。

![](https://cloud.githubusercontent.com/assets/7932380/17461239/3670c37a-5cb8-11e6-9825-9449c8822a96.png)


## 在安卓上面运行

CyanogenMod 的开发者选项中自带了网络ＡDB调试,使用adb连接，开启wifi调试模式,如果直接使用usb连接步骤更简单
![](https://cloud.githubusercontent.com/assets/7932380/17461295/f26857e0-5cb9-11e6-91f2-2b349c5accb4.png)

运行 react-native run-android ，报错 failed to find Build Tools revision 23.0.2
![err](https://cloud.githubusercontent.com/assets/7932380/17461335/b12d6728-5cbb-11e6-9649-3494e5e53edb.png)

 打开Android Studio],[勾选上需要的sdk](https://github.com/fbsamples/f8app/issues/68).
 ![](https://cloud.githubusercontent.com/assets/7932380/17461352/45b1c11e-5cbc-11e6-981d-35fffaa5da35.png)
 安装完毕
 ![](https://cloud.githubusercontent.com/assets/7932380/17461362/b38f42ec-5cbc-11e6-950c-29353e792995.png)
 再次执行  react-native run-android,报错：　Cannot evaluate module react-native-fbsdk : Configuration with name 'default' not found
 找到相关的[issue](https://github.com/facebook/react-native-fbsdk/issues/205)，osx不区分路径的大小写，而linux系统下路径区分大小写。
 安装的node_modules中 react-native-fbsdk 的路径图
 ![](https://cloud.githubusercontent.com/assets/7932380/17461697/e1d010c2-5cc7-11e6-83bb-9811ec8c326b.png)

在[settings.gradle](https://github.com/fbsamples/f8app/blob/master/android/settings.gradle#L13) 文件13行，路径是大写。
![](https://cloud.githubusercontent.com/assets/7932380/17461709/25a96a00-5cc8-11e6-82bf-d2f19b9f02b3.png)

将其修改为小写的android,问题解决，apk也通过adb命令成功安装。

![](https://cloud.githubusercontent.com/assets/7932380/17461762/1e737756-5cca-11e6-95b7-4818955b5bf9.png)
因为是使用wifi调试模式，点击Menu键->Dev Settings->Debug server host & port for device 输入 192.168.1.106:8081
192.168.1.105是安卓的ip地址，192.168.1.106是我们本机开发环境的IP地址，如果不知道可以使用ifconfig查看。
具体调试文档[参考这里](https://facebook.github.io/react-native/docs/running-on-device-android.html)


执行　react-native start 命令，安卓重新Reload，后台输出日志
![](https://cloud.githubusercontent.com/assets/7932380/17461870/db98eabc-5ccc-11e6-8cb7-22a6994dd2c9.png)


最后展示下结果
![](https://cloud.githubusercontent.com/assets/7932380/17461893/589393be-5ccd-11e6-9740-baed49713f67.png)

EOF




