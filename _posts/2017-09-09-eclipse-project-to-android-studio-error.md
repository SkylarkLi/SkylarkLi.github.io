---
layout: post
title: Android Studio导入Eclipse项目工程错误汇总
date: 2017-09-09
tags: [Android, Android Studio,Eclipse]
---

### 前言

最近有几个Eclipse下的项目需要导入到Android Studio中，本想应该很简单的，谁知遇到了一大推的问题，特地在此记录一下（后续如果有遇到其他的问题再添加进来）。


### 错误汇总

* 错误一 
> Error:Application and test application id cannot be the same: both are 'cn.example.application' for debugAndroidTest

这个错误是因为`applicationId`和`testApplicationId`相同。

解决方法：修改项目Module下build.gradle中的testApplicationId,不能和applicationId相同。

* 错误二
> Error: java.lang.RuntimeException: Some file crunching failed, see logs for details

解决方法：这个错误经过验证发现是因为项目中有些 `.9.png` 不符合Android Studio的要求，所以只需要重新绘制 `.9.png`即可。

* 错误三
> Error: NDK integration is deprecated in the current plugin.Consider trying the new experimental plugin.Set "$USE_DEPRECATED_NDK=true" in gradle.properties to continue using the current NDK integration.

[参考解决方案](https://stackoverflow.com/questions/31979965/after-updating-android-studio-to-version-1-3-0-i-am-getting-ndk-integration-is)

解决方法：在项目的根目录添加`gradle.properties`文件，并在文件中添加`android.useDeprecatedNdk=true`

* 错误四 
> Error:(97) undefined reference to __android_log_print

[参考解决方案](http://blog.csdn.net/keyue0459/article/details/8764508)

解决方法：
```c++
Android.mk中增加	LOCAL_LDLIBS    := -lm -llog 
宏定义
#define  LOG_TAG    “skylark"
#define  LOGI(...)  __android_log_print(ANDROID_LOG_INFO,LOG_TAG,
__VA_ARGS__)

还要加	#include <Android/log.h>
注意android.mk 里有一行include $(CLEAR_VARS)
必须把LOCAL_LDLIBS :=-llog放在它后面才有用，否则相当于没写
```

* 错误五
> Error while executing 'D:\Software\Android\sdk\ndk-bundle\ndk-build.cmd' 
> with arguments {
> NDK_PROJECT_PATH=null
> APP_BUILD_SCRIPT=E:\xxx\build\intermediates\ndk\release\Android.mk APP_PLATFORM=android-21
> NDK_OUT=E:\xxx\build\intermediates\ndk\release\obj
> NDK_LIBS_OUT=E:\xxx\build\intermediates\ndk\release\lib APP_ABI=all
> }

[参考解决方案](http://blog.csdn.net/wyyl1/article/details/44198179)

解决方法：
```groovy
//在有JNI的那个项目下的build.gradle文件中添加如下代码
android {  
    ...  
    sourceSets.main {  
        jni.srcDirs = []  
        jniLibs.srcDir 'src/main/libs'  
    }  
} 
```

* 错误六
> Manifest merger failed : Attribute application@name value=(cn.example.application.MyApp) from AndroidManifest.xml is also present at [APP:MyProject:unspecified] AndroidManifest.xml value=(cn.example.application.MyApp).
> Suggestion: add 'tools:replace="android:name"' to <application> element at AndroidManifest.xml to override.

解决方法：修改AndroidManifest.xml中的<application>标签下的application的name，改为全名称，也就是包名.类名，并加上tools:replace="android:name"

* 错误七
> E:\AndroidStudioProjects\MyApplication\APP\src\main\java\com\MainActivity.java
Error:(1, 1) 错误: 非法字符: '\ufeff'
Error:(1, 10) 错误: 需要class, interface或enum

这个问题是由于文件编码的错误导致的。

解决方法：利用notepad++ 将MainActivity.java的编码格式改为以UTF-8无BOM格式编码

### 写在最后

以上就是目前遇到的Eclipse项目导入到Android Studio中产生的错误。后续如果还有其他问题会将其加入其中。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。  


转载请注明：[XueLong的博客](http://himakeit.online) » [Android Studio导入Eclipse项目工程错误汇总](http://himakeit.online/2017/09/eclipse-project-to-android-studio-error/)