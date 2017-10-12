---
layout: post
title: Android调用外部ContentProvider失败
date: 2017-09-07
tags: [Android, ContentProvider, Android四大组件]
---

### 前言

无意中遇到调用外部的 `ContentProvider` 报 `java.lang.SecurityException: Permission Denial: opening provider`错误， 记录一下解决方法。
   
### 错误原因及解决方法

>报错日志   

```java
Process: online.himakeit.testcontentprovider, PID: 6668
java.lang.SecurityException: Permission Denial: opening provider 
	online.himakeit.skylarkdemo.provider.DBSQLProvider from ProcessRecord{7dc9495 6668:online.himakeit.testcontentprovider/u0a93} 
	(pid=6668, uid=10093) that is not exported from UID 10094
    at android.os.Parcel.readException(Parcel.java:1942)
    at android.os.Parcel.readException(Parcel.java:1888)
    at android.app.IActivityManager$Stub$Proxy.getContentProvider(IActivityManager.java:4771)
    at android.app.ActivityThread.acquireProvider(ActivityThread.java:5882)
    at android.app.ContextImpl$ApplicationContentResolver.acquireProvider(ContextImpl.java:2479)
    at android.content.ContentResolver.acquireProvider(ContentResolver.java:1733)
    at android.content.ContentResolver.insert(ContentResolver.java:1533)
    at online.himakeit.testcontentprovider.MainActivity.onClick(MainActivity.java:53)
    at android.view.View.performClick(View.java:6256)
    at android.view.View$PerformClick.run(View.java:24697)
    at android.os.Handler.handleCallback(Handler.java:789)
    at android.os.Handler.dispatchMessage(Handler.java:98)
    at android.os.Looper.loop(Looper.java:164)
    at android.app.ActivityThread.main(ActivityThread.java:6541)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.Zygote$MethodAndArgsCaller.run(Zygote.java:240)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:767)
```

产生 `java.lang.SecurityException: Permission Denial: opening provider` 错误的原因是，外部的 `ContentProvider` 不能被外部所调用。

解决方式就是在定义 `ContentProvider` 时在 `<provider>` 标签下添加 `android:exported="true"` 属性，并将其值设为 `true` 。

> * `android:exported` 主要作用是：是否支持其他应用调用当前组件
> * `Android` 中的四大组件 `Activity`、`Service`、`ContentProvider`、`BroadcastReceiver` 都有 `android:exported`这个属性

### 写在最后

以上就是如何解决`java.lang.SecurityException: Permission Denial: opening provider`问题。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。   



转载请注明：[XueLong的博客](http://himakeit.online) » [Android调用外部ContentProvider失败](http://himakeit.online/2017/09/android-permission-denial-opening-provider/)