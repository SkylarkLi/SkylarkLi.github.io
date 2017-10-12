---
layout: post
title: Android Studio Generate Signed APK 错误汇总
date: 2017-09-12
tags: [Android, Android Studio,Signed APK]
---

### 前言
总结一下最近使用Android Studio 签名APK时遇到的问题。

### 错误汇总

* 问题一
> Error: Avoid non-default constructors in fragments: use a default constructor plus Fragment#setArguments(Bundle) instead [ValidFragment]

[参考链接](https://stackoverflow.com/questions/30638421/error-avoid-non-default-constructors-in-fragments-use-a-default-constructor-pl)

解决方式：在Moudel下的build.gradle添加如下代码
```java
android {
    lintOptions {
        checkReleaseBuilds false
    }
}
```

* 问题二
> Error: Expected resource of type styleable [ResourceType] 
> Error: Expected resource of type id [ResourceTyp]
> Error: Expected resource of type raw [ResourceType]

[参考链接](http://blog.csdn.net/wan903531306/article/details/51802272)

```java
@SuppressWarnings("ResourceType")
```

### 写在最后

以上就是目前在使用Android Studio签名APK时遇到的问题的解决方式。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。  


转载请注明：[XueLong的博客](http://himakeit.online) » [Android Studio Generate Signed APK 错误汇总](http://himakeit.online/2017/09/android-studio-generatesigned-apk-error/)