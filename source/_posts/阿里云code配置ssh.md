---
title: 阿里云code配置ssh
date: 2016-09-20 18:27:28
tags: Linux
---

 <!-- more -->

今天无意在网络上发现了[阿里云Code](https://code.aliyun.com/users/sign_in)，这是在[GitLab](https://about.gitlab.com/)进行再开发的，所以一些使用体验和内网部署的GitLab是一致的．

## 生成SSH key

参考GitHub这篇文章　[Generating a new SSH key and adding it to the ssh-agent - User Documentation](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)
``` bash
google@H:~/.ssh$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/google/.ssh/id_rsa): id_rsa_code_aliyun
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in id_rsa_code_aliyun.
Your public key has been saved in id_rsa_code_aliyun.pub.
The key fingerprint is:
ff:af:52:d0:e8:23:4f:84:40:ae:5e:44:6a:cb:a7:0c your_email@example.com
The key's randomart image is:
+--[ RSA 4096]----+
|     .o          |
|     +.          |
|    o o. . o     |
|   o +  . + .    |
|  E + o So .     |
|   + +  ..+ .    |
|    +    +.o     |
|          o.     |
|           .oo.  |
+-----------------+
google@H:~/.ssh$ ls id_rsa_code_aliyun* -a
id_rsa_code_aliyun  id_rsa_code_aliyun.pub
```

id_rsa_code_aliyun是SSH中的私钥，id_rsa_code_aliyun.pub则是SSH中对应的公钥，我们要把公钥的内容发布出去，自己保留私钥就可以了．

## 添加公钥id_rsa_code_aliyun.pub到阿里云Code
这里我建议使用gedit打开文件后CTRL+A CTRL+C复制，因为vi里面复制的话会带有空格．


## 配置.ssh config文件

可以参考阿里云ssh的[README](https://code.aliyun.com/help/ssh/README)


文件地址　~/.ssh/config ,如果没有的话　touch config 即可，然后在里面添加下面的内容
``` bash
Host code.aliyun.com
  HostName code.aliyun.com
  IdentityFIle ~/.ssh/id_rsa_code_aliyun
```


## 验证连通成功
继续参考GitHub [Testing your SSH connection - User Documentation](https://help.github.com/articles/testing-your-ssh-connection/)

如果连接成功,
``` bash
google@H:~/.ssh$ ssh -T git@code.aliyun.com

  ****    Welcome to aliyun Code     ****

  Hi ${your_email}, you have successfully connected over SSH.

  To clone a hosted Git repository, use:

  git clone git@localhost/REPOSITORY_NAME.git

```
如果没有配置config文件，报错如下：

``` bash
google@H:~/.ssh$ ssh -T git@code.aliyun.com
The authenticity of host 'code.aliyun.com (120.55.150.20)' can't be established.
RSA key fingerprint is 69:ab:cb:07:eb:a3:e1:f3:0b:2e:f4:23:b0:c1:c6:9a.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'code.aliyun.com,120.55.150.20' (RSA) to the list of known hosts.
Received disconnect from 120.55.150.20: 2: Too many authentication failures
```


EOF

