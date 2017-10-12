---
layout: post
title: Can't toast on a thread that has not called Looper.prepare()
date: 2017-09-29
tags: [Android, Toast, Error]
---

### 前言

最近一段时间在忙着开发一款自己的APP，将自己常用的功能需求都加入进入，同时在GitHub上跟着大牛们学习新的技术，提升自己的技能，在开发的过程中不断的发现问题和解决问题。    
在开发过程遇到了这样一个问题：`Can't toast on a thread that has not called Looper.prepare() `，如果在一个线程中没有调用Looper.prepare(),就不能在该线程中创建Toast。这个问题是因为在子线程中弹出Toast导致的。      
Android是不能直接在子线程中弹出Toast的，可是如果我们非要这么做，那该怎么办呢？下面就为大家讲解如何在子线程中弹出Toast，以及一些其他类似的子线程中操作的错误。

​    
### 目录

* [在子线程中调用Toast](#create-toast)
* [在子线程中更新UI](#update-ui)
* [在子线程中创建Handler](#create-handler)
* [写在最后](#the-end)
* [参考资源](#reference-data)

### <a name="create-toast"></a>在子线程中调用Toast

> 在子线程中弹出Toast，会报错：java.lang.RuntimeException: Can't toast on a thread that has not called Looper.prepare()。

解决方式：先调用`Looper.prepare();`再调用`Toast.makeText().show();`最后再调用`Looper.loop();`

```java
public class ToastUtils {
    static Toast toast = null;
    public static void show(Context context, String text) {
        try {
            if(toast!=null){
                toast.setText(text);
            }else{
                toast= Toast.makeText(context, text, Toast.LENGTH_SHORT);
            }
            toast.show();
        } catch (Exception e) {
            //解决在子线程中调用Toast的异常情况处理
            Looper.prepare();
            Toast.makeText(context, text, Toast.LENGTH_SHORT).show();
            Looper.loop();
        }
    }
}
```

### <a name="update-ui"></a>在子线程中更新UI
> 在子线程中更新UI，会报错：android.view.ViewRootImpl$CalledFromWrongThreadException: Only the original thread that created a view hierarchy can touch its views.

解决方式：在子线程中更新UI，一般使用Handler或者runOnUiThread()或者AsyncTask。

### <a name="create-handler"></a>在子线程中创建Handler
> 在子线程中创建Handler，会报错：java.lang.RuntimeException: Can't create handler inside thread that has not called Looper.prepare()。

解决方式：
```java
new Thread() {
　　public void run() {
　　　　Looper.prepare();
　　　　new Handler().post(runnable);//在子线程中直接去new 一个handler
　　　　Looper.loop();　　　　//这种情况下，Runnable对象是运行在子线程中的，可以进行联网操作，但是不能更新UI
　　}
}.start();
```

### <a name="the-end"></a>写在最后

以上就是在子线程中更新UI、弹出Toast、创建Handler时会遇到的问题，及解决方式。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。   

### <a name="reference-data"></a>参考资源
* <a href="http://www.cnblogs.com/jingmo0319/p/5730963.html" target="_blank">在子线程中new Handler报错</a>   
* <a href="http://blog.csdn.net/heng615975867/article/details/9194219" target="_blank">Android -- Looper.prepare()和Looper.loop() —深入版</a> 
* <a href="http://jeff-pluto-1874.iteye.com/blog/869710" target="_blank">Toast和Looper、Handler消息循环机制</a> 


转载请注明：[XueLong的博客](http://himakeit.online) » [Can't toast on a thread that has not called Looper.prepare()](http://himakeit.online/2017/09/android-toast-error-on-thread/)