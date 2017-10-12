---
layout: post
title: Android Studio代码混淆
date: 2017-08-14
tags: [Android, Android-Studio, 代码混淆]
---

### 前言

最近两天研究了一下，如何在Android Studio中配置代码混淆，代码混淆不仅仅可以保护我们的代码，他还有精简编译后程序大小的作用，下面就详细讲解一下，该如何给我们的项目配置代码混淆。  <a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a>   
    
### 目录

* [build.gradle中的配置](#build-gradle)
* [编写自己的混淆规则](#your-proguard)
* [写在最后](#the-end)
* [参考资源](#reference-data)

### <a name="build-gradle"></a>build.gradle中的配置

> 首先需要在 `Module` 的 `build.gradle` 中将 `minifyEnabled` 的属性值改为 `true` ，这里的 `minifyEnable` 就是是否需要混淆的意思，它的默认值是 `false` ,其中 `proguard-Android.txt` 文件是本地 `sdk/tools/proguard` 文件夹下的默认文件, `prguard-rules.pro` 文件就是用来编写混淆代码的。
   
```java
buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
```

### <a name="your-proguard"></a>编写自己的混淆规则

> 就是修改proguard-rules.pro文件，在其中书写自己的混淆规则。下面直接放上我的配置文件。
   
```xml
# 在prguard-rules.pro文件中写的，其实就是混淆规则，规定哪些东西不需要混淆。
#自己编写的代码中大致就是一些重要的类需要混淆，而混淆的本质就是精简类名，用简单的a,b,c等单词来代替之前写的如DataUtil等易懂的类名。
#所以，理解了这点，也就好理解这个混淆文件该怎么写了，大致思路就是：
#不混淆第三方库，不混淆系统组件，一般也可以不混淆Bean等模型类，因为这些对别人都是没用的，毕竟都是开源的。。。

#混淆配置设定
-optimizationpasses 5 #指定代码压缩级别
-dontusemixedcaseclassnames #混淆时不会产生形形色色的类名
-dontskipnonpubliclibraryclasses #指定不忽略非公共类库
-dontpreverify #不预校验，如果需要预校验，是-dontoptimize
-ignorewarnings #屏蔽警告
-verbose #混淆时记录日志
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/* #优化

#-不需要混淆第三方类库
-dontwarn android.support.v4.** #去掉警告
-keep class android.support.v4.** { *; } #过滤android.support.v4
-keep interface android.support.v4.app.** { *; }
-keep public class * extends android.support.v4.**
-keep public class * extends android.app.Fragment
-keep class org.apache.**{*;} #过滤commons-httpclient-3.1.jar
-keep class com.fasterxml.jackson.**{*;} #过滤jackson-core-2.1.4.jar等
-dontwarn com.lidroid.xutils.** #去掉警告
-keep class com.lidroid.xutils.**{*;} #过滤xUtils-2.6.14.jar
-keep class * extends java.lang.annotation.Annotation{*;} #这是xUtils文档中提到的过滤掉注解
-dontwarn com.baidu.** #去掉警告
-dontwarn com.baidu.mapapi.**
-keep class com.baidu.** {*;} #过滤BaiduLBS_Android.jar
-keep class vi.com.gdi.bgl.android.**{*;}
-keep class com.baidu.platform.**{*;}
-keep class com.baidu.location.**{*;}
-keep class com.baidu.vi.**{*;}
# 去掉与 MPAndroidChart jar包相关的
-dontnote com.github.mikephil.charting.**
-keep class com.github.mikephil.charting.** {*;}
# 去掉与 leakcanary jar包相关的
-dontnote com.squareup.leakcanary.**
-keep class com.squareup.leakcanary.** {*;}
# 去掉与 Ksoap2 jar包相关的
-dontnote org.ksoap2.**
-dontnote org.kobjects.**
-dontnote org.kxml2.**
-dontnote org.xmlpull.v1.**
-keep class org.kobjects.** {*;}
-keep class org.ksoap2.** {*;}
-keep class org.kxml2.** {*;}
-keep class org.xmlpull.v1.** {*;}
# 去掉与 SlideAndDragListView jar包相关的
-dontnote com.yydcdut.sdlv.**
-keep class com.yydcdut.sdlv.** {*;}
# 去掉与 pulltorefresh jar包相关的
-dontnote com.handmark.pulltorefresh.**
-keep class com.handmark.pulltorefresh.** {*;}
# 去掉与 de.greenrobot.dao jar包相关的
-dontnote de.greenrobot.dao.**
-keep class de.greenrobot.dao.** {*;}
# 去掉与 de.greenrobot.daogenerator jar包相关的
-dontnote de.greenrobot.daogenerator.**
-keep class de.greenrobot.daogenerator.** {*;}

# 去掉与 gson jar包相关的
# removes such information by default, so configure it to keep all of it.
-keepattributes Signature
# Gson specific classes
-keep class sun.misc.Unsafe { *; }
-keep class com.google.gson.stream.** { *; }
# Application classes that will be serialized/deserialized over Gson
-keep class com.google.gson.examples.android.model.** { *; }
-keep class com.google.gson.** { *;}
#这句非常重要，主要是滤掉 com.demo.demo.bean包下的所有.class文件不进行混淆编译,com.demo.demo是你的包名
-keep class com.demo.demo.bean.** {*;}

# 去掉与 butterknife jar包相关的
-keep class butterknife.** { *; }
-dontwarn butterknife.internal.**
-keep class **$$ViewBinder { *; }
-keep class **$$ViewInjector {*;} #就是这里没有添加，导致我的整个程序出错（因为我在程序中使用的是InjectView而不是BindView）
-keepclasseswithmembernames class * {
    @butterknife.* <fields>;
}
-keepclasseswithmembernames class * {
    @butterknife.* <methods>;
}

#不需要混淆系统组件等
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.preference.Preference
-keep public class com.android.vending.licensing.ILicensingService

#保护指定的类和类的成员，但条件是所有指定的类和类成员是要存在
-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}
-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}
-keepclassmembers class * extends android.support.v7.app.AppCompatActivity {
public void *(android.view.View);
}

#-自己编写的类的操作
-keep class com.skylark.model.**{*;} #过滤掉自己编写的实体类                               #过滤掉自己编写的实体类

# 过滤R文件的混淆：
-keep class **.R$* {*;}
```   
   
### <a name="the-end"></a>写在最后

代码混淆关键部分就是在自己使用的第三方jar包上，这个就要看看你使用的第三方jar包的相关说明了。一般在说明中都会说明该如何操作的。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。   

### <a name="reference-data"></a>参考资源
* <a href="http://blog.csdn.net/z157794218/article/details/40039785" target="_blank">代码混淆详解</a>   
* <a href="http://blog.csdn.net/ttccaaa/article/details/47687241" target="_blank">AndroidStudio中代码混淆以及打包操作</a> 


转载请注明：[XueLong的博客](http://himakeit.online) » [Android Studio代码混淆](http://himakeit.online/2017/08/android-androidstudio-proguard/)