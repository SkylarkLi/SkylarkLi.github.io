---
layout: post
title: Android Studio代码混淆-第三方jar混淆汇总（持续更新）
date: 2017-08-15
tags: [Android, Android-Studio, 代码混淆]
---

### 前言

Android有非常多的优秀的第三方开源jar包，我们经常在我们的项目中使用了不少jar包，但是往往到了release的时候就忘了混淆第三方jar包了，会给我们开发带来不少麻烦，所有在这里汇总一下一些比较热门的第三方jar包的混淆方式，方便大家开发。本篇文章会持续更新，如果你有其它jar包的混淆使用方式也可以告知我，以便可以更好的为大家提供一份较为完整实例。   
​    
### 常用第三方开源jar包

> 排名不分先后（按首字母顺序排列）


**Android-gif-drawable** [链接](https://github.com/koral--/android-gif-drawable)   

```java
-keep public class pl.droidsonroids.gif.GifIOException{<init>(int);}
-keep class pl.droidsonroids.gif.GifInfoHandle{<init>(long,int,int,int);}
```

**Android-Universal-Image-Loader** [链接](https://github.com/nostra13/Android-Universal-Image-Loader)   

```java
#Universal Image Loader
-keep class com.nostra13.universalimageloader.** { *; }
-keepattributes Signature
```

**ButterKnife** [链接](https://github.com/JakeWharton/butterknife)   

```java
-keep class butterknife.** { *; }
-dontwarn butterknife.internal.**
-keep class **$$ViewBinder { *; }
-keep class **$$ViewInjector
-keepclasseswithmembernames class * {    
   @butterknife.* <fields>;
}
-keepclasseswithmembernames class * {    
   @butterknife.* <methods>;
}
```

**Bugly** [链接](http://bugly.qq.com/)   

```java
-keep public class com.tencent.bugly.**{*;}
```

**EventBus** [链接](https://github.com/greenrobot/EventBus)   

```java
-keepclassmembers class ** {
    public void onEvent*(***);
}

# Only required if you use AsyncExecutor
-keepclassmembers class * extends de.greenrobot.event.util.ThrowableFailureEvent {
    public <init>(java.lang.Throwable);
}

# Don't warn for missing support classes
-dontwarn de.greenrobot.event.util.*$Support
-dontwarn de.greenrobot.event.util.*$SupportManagerFragment
```

**Fabric Twitter Kit** [链接](https://dev.twitter.com/twitter-kit/android/integrate)   

```java
-dontwarn com.squareup.okhttp.**
-dontwarn com.google.appengine.api.urlfetch.**
-dontwarn rx.**
-dontwarn retrofit.**
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.squareup.okhttp.** { *; }
-keep interface com.squareup.okhttp.** { *; }
-keep class retrofit.** { *; }
-keepclasseswithmembers class * {
    @retrofit.http.* *;
}
```

**Fastjson** [链接](https://github.com/alibaba/fastjson)   

```java
-dontwarn com.alibaba.fastjson.**
-keepattributes Signature
-keepattributes *Annotation*
```

**Glide** [链接](https://github.com/bumptech/glide)   

```java
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.AppGlideModule
-keep public enum com.bumptech.glide.load.resource.bitmap.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# for DexGuard only
-keepresourcexmlelements manifest/application/meta-data@value=GlideModule
```


**Gson** [链接](https://github.com/google/gson/)   

```java
# Gson uses generic type information stored in a class file when working with fields. Proguard
# removes such information by default, so configure it to keep all of it.
-keepattributes Signature

# For using GSON @Expose annotation
-keepattributes *Annotation*

# Gson specific classes
-keep class sun.misc.Unsafe { *; }
#-keep class com.google.gson.stream.** { *; }

# Application classes that will be serialized/deserialized over Gson
-keep class com.google.gson.examples.android.model.** { *; }

# Prevent proguard from stripping interface information from TypeAdapterFactory,
# JsonSerializer, JsonDeserializer instances (so they can be used in @JsonAdapter)
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
```

**环信SDK** [链接](http://docs.easemob.com/im/start)   

```java
-keep class com.easemob.** {*;}
-keep class org.jivesoftware.** {*;}
-keep class org.apache.** {*;}
-dontwarn  com.easemob.**
#2.0.9后的不需要加下面这个keep
#-keep class org.xbill.DNS.** {*;}
#另外，demo中发送表情的时候使用到反射，需要keep SmileUtils
-keep class com.easemob.chatuidemo.utils.SmileUtils {*;}
#注意前面的包名，如果把这个类复制到自己的项目底下，比如放在com.example.utils底下，应该这么写(实际要去掉#)
#-keep class com.example.utils.SmileUtils {*;}
#如果使用easeui库，需要这么写
-keep class com.easemob.easeui.utils.EaseSmileUtils {*;}
#2.0.9后加入语音通话功能，如需使用此功能的api，加入以下keep
-dontwarn ch.imvs.**
-dontwarn org.slf4j.**
-keep class org.ice4j.** {*;}
-keep class net.java.sip.** {*;}
-keep class org.webrtc.voiceengine.** {*;}
-keep class org.bitlet.** {*;}
-keep class org.slf4j.** {*;}
-keep class ch.imvs.** {*;}

```

**LitePal** [链接](https://github.com/LitePalFramework/LitePal)   

```java
-keep class org.litepal.** {
    *;
}

-keep class * extends org.litepal.crud.DataSupport {
    *;
}
```

**Okhttp** [链接](http://square.github.io/okhttp/)   

```java
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
```

**OkhttpUtils** [链接](https://github.com/hongyangAndroid/okhttputils)   

```java
#okhttputils
-dontwarn com.zhy.http.**
-keep class com.zhy.http.**{*;}

#okhttp
-dontwarn okhttp3.**
-keep class okhttp3.**{*;}

#okio
-dontwarn okio.**
-keep class okio.**{*;}
```

**Picasso** [链接](https://square.github.io/picasso/)   

```java
-dontwarn com.squareup.okhttp.**
```

**Retrofit2** [链接](https://square.github.io/retrofit/)   

```java
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions

-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

```

**RxJava** [链接](https://github.com/ReactiveX/RxJava)   

```java
-keep class rx.schedulers.Schedulers {
    public static <methods>;
}
-keep class rx.schedulers.ImmediateScheduler {
    public <methods>;
}
-keep class rx.schedulers.TestScheduler {
    public <methods>;
}
-keep class rx.schedulers.Schedulers {
    public static ** test();
}
```

**ShareSDK** [链接](http://wiki.mob.com/android-sharesdk%E5%AE%8C%E6%95%B4%E7%9A%84%E9%9B%86%E6%88%90%E6%96%87%E6%A1%A3/)   

```java
-keep class cn.sharesdk.**{*;}
-keep class com.sina.**{*;}
-keep class **.R$* {*;}
-keep class **.R{*;}
-dontwarn cn.sharesdk.**
-dontwarn **.R$*
-dontwarn com.tencent.**
-keep class com.tencent.** {*;}

```

**SlidingMenu** [链接](https://github.com/jfeinstein10/SlidingMenu)   

```java
-dontwarn com.jeremyfeinstein.slidingmenu.lib.**
-keep class com.jeremyfeinstein.slidingmenu.lib.**{*;}
```

   

> 补充几个非常不错的代码混淆相关的开源项目   

**AndResGuard** [链接](https://github.com/shwenzhang/AndResGuard)   

>  Android 源混淆

**android-proguard-snippets** [链接](https://github.com/krschultz/android-proguard-snippets)   

>  一个更棒的项目，几乎整合了所有常见的第三方jar包的混淆方式。



### 写在最后

以上就是目前所整理的第三方开源jar包的代码混淆方式，如果你有其他的jar包的使用方式可以给我留言，我会添加上去。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。   

### 参考资源
* <a href="http://www.jianshu.com/p/155430a27f00" target="_blank">Android混淆配置总结-持续更新</a>   



转载请注明：[XueLong的博客](http://himakeit.online) » [Android Studio代码混淆-第三方jar混淆汇总（持续更新）](http://himakeit.online/2017/08/android-androidstudio-proguard-third-party-jar/)