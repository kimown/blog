---
title: openshift使用alinode
date: 2016-08-20 23:59:05
tags: Node.js
---

 [衔接上文](https://kimown.github.io/2016/08/13/openshift%E6%90%AD%E5%BB%BA%E5%BA%94%E7%94%A8/)

<!-- more -->

## 安装alinode

下面是在openshift里面自定义使用alinode作为启动应用的版本，整体的思路很简单，看了下[install.sh](https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh)的代码，大致意思是在$HOME目录下创建一个.tnvm目录，然后git下载对应的代码,最终运行的tnvm命令在[tnvm.sh](https://github.com/aliyun-node/tnvm/blob/master/tnvm.sh)。那我们只要把$OPENSHIFT_DATA_DIR目录作为$HOME目录就可以了。

![](https://cloud.githubusercontent.com/assets/7932380/17834611/9ccd5b24-677b-11e6-8564-fa4b79fc3d0b.png)

``` bash
export HOME=$OPENSHIFT_DATA_DIR
cd $HOME
wget -O- https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh | bash
source $HOME/.bash_profile
tnvm ls-remote alinode
tnvm install alinode-v1.6.0
```

注意openshift下载alinode的速度很慢，注意下tnvm.sh [467行](https://github.com/aliyun-node/tnvm/blob/master/tnvm.sh#L467)和 [474行](https://github.com/aliyun-node/tnvm/blob/master/tnvm.sh#L474),这里会针对不同的操作系统下载我们自定义输入的[alinode的版本](http://alinode.aliyun.com/dist/new-alinode)。
下载完毕后，测试下node的版本，更新下npm的版本。

![](https://cloud.githubusercontent.com/assets/7932380/17834737/a4a852ea-6780-11e6-9f52-012483aedf01.png)


``` bash
tnvm use alinode-v1.6.0
node -p 'process.alinode'
which node
which npm
npm install npm  -g
npm -v
```
node 的目录在$OPENSHIFT_DATA_DIR/.tnvm/versions/alinode/v1.6.0/bin这个目录下。
注意 tnvm是通过修改path路径的方法来使用alinode的，但是除$OPENSHIFT_DATA_DIR目录外，我们在openshift上的修改是临时的，所以下次登陆时本次修改会失效，唯一保留的是.tnvm里面的下载的文件

## 使用alinode

修改start代码，主要是各个命令的路径问题，如果是VPS的话就没有这么多事了。
``` bash
#!/bin/bash
# The logic to start up your application should be put in this
# script. The application will work only if it binds to
# $OPENSHIFT_DIY_IP:8080
#nohup $OPENSHIFT_REPO_DIR/diy/testrubyserver.rb $OPENSHIFT_DIY_IP $OPENSHIFT_REPO_DIR/diy |& /usr/bin/logshifter -tag diy &


export ALINODEPATH=$OPENSHIFT_DATA_DIR/.tnvm/versions/alinode/v1.6.0
export PATH=$ALINODEPATH/bin:$PATH

export npm_config_cache=$OPENSHIFT_REPO_DIR/diy/.npm
export npm_config_userconfig=$OPENSHIFT_REPO_DIR/diy/.npmrc


source $OPENSHIFT_DATA_DIR/.bash_profile
tnvm use alinode-v1.6.0
echo $(node -v)

cd $OPENSHIFT_REPO_DIR/diy
npm install
nohup node $OPENSHIFT_REPO_DIR/diy/index.js &

```


![](https://cloud.githubusercontent.com/assets/7932380/17834822/c38bc382-6784-11e6-8034-d575334da976.png)

红框里面是 tnvm.sh[755行](https://github.com/aliyun-node/tnvm/blob/master/tnvm.sh#L755),$HOME和$OPENSHIFT_DATA_DIR不相等导致的，一个办法是直接修改tnvm.sh里面的$HOME目录为$OPENSHIFT_DATA_DIR，但不修改的话也不影响使用。
下面是使用alinode的版本，对应上面代码16行，然后 echo $(node -v) 打印出alinode对应的node的版本号，对应上面代码17行，[详细对应版本参考](https://alinode.aliyun.com/doc/alinode_versions)

如果出现下面的输出，说明代码已经成功运行在openshift上面了
![](https://cloud.githubusercontent.com/assets/7932380/17834865/6cabb746-6786-11e6-9574-c8e52d4b8f68.png)

打开[https://node-kimown.rhcloud.com/](https://node-kimown.rhcloud.com/),输出结果
![](https://cloud.githubusercontent.com/assets/7932380/17834872/ccd07fe4-6786-11e6-80df-043a2bbf9e48.png)
对应 [openshift搭建应用](https://kimown.github.io/2016/08/13/openshift%E6%90%AD%E5%BB%BA%E5%BA%94%E7%94%A8/)里面express的代码
![](https://cloud.githubusercontent.com/assets/7932380/17834883/349beed8-6787-11e6-9340-2e8ac430af12.png)


EOF





