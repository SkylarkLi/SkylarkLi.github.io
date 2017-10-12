---
layout: post
title: 使用Jekyll + GitHub Pages搭建个人博客（绑定域名）
date: 2017-08-08
tags: [GitHub Pages, Jekyll, 博客]
---

### 前言

在上一篇<a href="/2017/08/jekyll-blog-build/" target="_blank"> 使用Jekyll + GitHub Pages搭建个人博客 </a>中已经向大家讲解了，如何通过GitHub Pages + Jekyll搭建一个属于自己的完全免费的个人博客，按照之前的教程现在你应该已经拥有一个自己独立的博客了，但是是不是觉得域名太长了？拼写太麻烦了？别担心，在本篇博客中我讲向你讲解如何给自己的博客绑定一个自己的域名。

### 目录

* [购买域名](#buy-domain)
* [绑定域名](#binding-domain)
* [添加A记录](#add-a)
* [DNS解析](#dns)
* [写在最后](#the-end)
* [参考资源](#reference-data)

### <a name="buy-domain"></a>购买域名

> 我的域名是在<a href="https://wanwang.aliyun.com/" target="_blank"> 万网 </a>上购买的，你可以购买一个自己喜欢的域名（PS：域名也可以在其它地方都买，不一定要在万网上购买，看个人喜好）。

### <a name="binding-domain"></a>绑定域名

> 在仓库根目录的`master`分支上创建文件`CNAME`，切记不能带后缀。并将不带协议名的裸域名写进去(`himakeit.online`或者`www.himakeit.online`，而不是`http://himakeit.online/`)
在GitHub上，你的仓库下进入到Settings栏位，如果在GitHub Pages处看到绿色打钩，说明配置文件成功了。
这一步也可以参考<a href="https://help.github.com/articles/setting-up-your-pages-site-repository/" target="_blank">官方文档</a>
   
![](/assets/images/posts/jekyll/github_newfile.png)

![](/assets/images/posts/jekyll/github_cname.png)
   
![](/assets/images/posts/jekyll/github_settings.png)
   
![](/assets/images/posts/jekyll/github_domain.png)

### <a name="add-a"></a>添加A记录

> 购买完，进入`管理控制台` -> `云解析` -> `解析` -> `添加解析` -> 添加`A`记录和`CNAME`记录 :  
> 
`skylarklxlong.github.io`  
>
`192.30.252.153`  
>
`192.30.252.154`
  
![](/assets/images/posts/jekyll/github_dns.png)

#### <a name="dns"></a>DNS解析

> 选中上一步中添加的三条记录点击启用即可可是DNS解析，大概10分钟左右就可以了。

> 现在你就可以使用新域名来开启你的博客了。

### <a name="the-end"></a>写在最后

以上便是如何给自己的博客绑定独立域名（此方法也适用在CSDN博客中）。

如果你在搭建博客遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，有关搭建个人博客的相关知识，欢迎继续关注我博客的更新。


### <a name="reference-data"></a>参考资源
* <a href="http://blog.csdn.net/garfielder007/article/details/50224761" target="_blank">利用github-pages建立个人博客</a>    
  

转载请注明：[XueLong的博客](http://himakeit.online) » [使用Jekyll + GitHub Pages搭建个人博客（绑定域名）](http://himakeit.online/2017/08/jekyll-blog-build-binding-domain/)  