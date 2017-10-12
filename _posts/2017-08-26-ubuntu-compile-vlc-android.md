---
layout: post
title: 从零开始，手把手教你如何在Ubuntu下编译VLC-Android源码
date: 2017-08-26
tags: [Ubuntu, Android, VLC, 源码编译]
---

### 前言

公司项目中使用的`libvlcjni.so`库文件,有点老，对`Android 6.0+`系统兼容性太差了，当程序运行在`Android6.0+`系统上时，回弹出警告框，提示`libvlcjni.so：text relocations`异常，虽然，程序播放视频没有问题，但是，总是弹出提示框就非常不友好了，为此，就需要重新编译一个新的库文件。   
由于，在编译中遇到了一大堆难题，足足花了3天时间才将`VLC-Android`源码编译成功。期间在网上查找了不少参考资料，但是，大都介绍太过详细，好多地方没有将清楚，非常容易误导他人，所以，决定下一篇详细的教程来记录此次编译的过程，希望能给大家带来帮助。    
特别感谢 [从零开始在Linux编译VLC-Android开源项目](http://blog.csdn.net/wkw1125/article/details/56845405) 这篇博客给我带来的帮助！
   
### VLC简介

VLC 是一款自由、开源的跨平台多媒体播放器及框架，可播放大多数多媒体文件，以及 DVD、音频 CD、VCD 及各类流媒体协议。VLC使用C语言开发，可跨平台编译为其他系统所用；`VLC-android`是将`VLC`编译为`Android`可调用类库（*.so）的工程。   
[VLC官网](http://www.videolan.org)   
[VLC-Android编译官方文档](https://wiki.videolan.org/AndroidCompile/)

### 编译系统配置

> * 编译系统环境为：Windows 10 企业版（版本1607）下 `VMware Workstation 12 Pro`（12.5.0 build-4352439）中安装的 `Ubuntu16.04 LTS 64位` 虚拟机。保证有一个稳定的网络环境，即使不能FQ也可以完成本次编译。    
> * 本次编译的VLC-Android版本为2.1.16，代码时间为2017-08-10，SHA1 ID:`6a04fdb0f10daf70ec4cc449c78d53c2a379f399`   
> * 本次编译的VLC版本未知，代码时间为2017-08-23，SHA1 ID：`85f0e45b2304afa64ace2e3f0ddc19ad8b5accfb`
> * VLC编译环境代码 `git clone https://code.videolan.org/videolan/vlc-android.git`   
> * vlc源码 `git clone http://git.videolan.org/git/vlc.git vlc`

### 编译环境配置

> * 编译VLC源码需要安装 JDK、NDK、SDK、automake、ant、autopoint、cmake、build-essential、 libtool、patch、pkg-config、protobuf-compiler、ragel、subversion、unzip、git   
> * 为了解决编译过程中不能下载 `build.gradle` 中的依赖环境问题，建议安装Android-Studio

#### JDK安装及环境变量配置

* 1、下载jdk   

[jdk-8u144-linux-x64.tar.gz](http://www.oracle.com/technetwork/java/javase/downloads/index.html)   

* 2、解压并赋权限   

```shell
sudo tar zxvf ./jdk-8u144-linux-x64.tar.gz
sudo chmod -R 777 jdk-8u144-linux-x64
``` 

如果你下载的是`zip`格式的则使用下面的命令进行解压    
```shell
unzip jdk-8u144-linux-x64.zip
```   

* 3、配置环境变量   

打开配置文件   
```shell
sudo gedit ~/.bashrc
```   

在配置文件文本末尾输入环境变量，保存并退出   
```shell
export JAVA_HOME=/home/skylark/Software/jdk1.8.0_144
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JAVA_BIN=$JAVA_HOME/bin
```   

使环境变量生效   
```shell
source ~/.bashrc
```   

验证是否配置成功   
```shell
java -version
```   

* 4、设置为ubuntu默认JDK    

```shell
sudo update-alternatives --config java    #查看根目录的Java，目前只有openJDK
sudo update-alternatives --install /usr/bin/java java /home/skylark/Software/jdk1.8.0_144/bin/java 300	#将oracle JDK安装到根目录
sudo update-alternatives --install /usr/bin/javac javac /home/skylark/Software/jdk1.8.0_144/bin/javac 300	#将oracle JDK安装到根目录
sudo update-alternatives --config java	#再次查看Java配置，输入对应序号，选择oracle JDK作为默认Java
```

#### SDK安装及环境变量配置

* 1、下载   

[android-sdk_r24.4.1-linux](https://dl.google.com/android/android-sdk_r24.4.1-linux.tgz?utm_source=androiddevtools.cn&utm_medium=website)   

* 2、解压，将解压后的文件夹命名为 `android-sdk`   

```shell
sudo tar zxvf ./android-sdk_r24.4.1-linux.tar
```   

* 3、配置环境变量   

打开配置文件   
```shell
sudo gedit ~/.bashrc
```   

在配置文件文本末尾输入环境变量，保存并退出   
```shell
export ANDROID_SDK=/home/skylark/Software/android-sdk	#VLC编译脚本只认 $ANDROID_SDK 环境变量
export PATH=$PATH:$ANDROID_SDK/tools:$ANDROID_SDK/platform-tools
```   

使环境变量生效   
```shell
source ~/.bashrc
```   

验证是否配置成功   
```shell
android list target
```   

#### NDK安装及环境变量配置

* 1、下载   

[android-ndk-r13b-linux-x86_64](https://dl.google.com/android/repository/android-ndk-r13b-linux-x86_64.zip)

* 2、解压   

```shell
unzip android-ndk-r13b-linux-x86_64.zip
```

* 3、配置环境变量   

打开配置文件   
```shell
sudo gedit ~/.bashrc
```   

在配置文件文本末尾输入环境变量，保存并退出   
```shell
export ANDROID_NDK=/home/skylark/Software/android-ndk-r13b	 #VLC编译脚本只认 $ANDROID_NDK 环境变量
export PATH=$PATH:$ANDROID_NDK
```   

使环境变量生效   
```shell
source ~/.bashrc
```   

验证是否配置成功   
```shell
ndk-build --version
```   

#### Android Studio安装

> 为了解决编译过程中不能下载 `build.gradle` 中的依赖环境问题，建议安装Android-Studio   
> 如果你可以FQ的话，可以跳过次步骤

[android-studio-ide-162.3871768-linux.zip](https://developer.android.google.cn/studio/archive.html#android-studio-2-3-1?utm_source=androiddevtools.cn&utm_medium=website)   

Android Studio的安装比较简单，由于篇幅的原因，这里就不再介绍了，记得安装时的SDK路径和NDK路径选择上面步骤中我们自己的路径。

#### 官方推荐工具包安装

> 官方给出了一条指令 `sudo apt-get install automake ant autopoint cmake build-essential libtool patch pkg-config protobuf-compiler ragel subversion unzip git` 来安装所需要的包环境，建议自己逐条安装，一步一步来，以便清楚的了解到每个包的安装情况。


#### protobuf3编译及安装

> 我所使用的代码，在编译环节要求使用protobuf3，而通过protobuf-compiler安装的是libprotoc2.6.1版本，会出现“Unrecognized syntax identifier “proto3”的错误。因此需要手动下载protobuf3，进行安装。    
> 这里我采用的是直接下载protobuf-3.0.0的源码，然后进行编译安装   
> [Google Github Protobuf 安装介绍](https://github.com/google/protobuf/blob/master/src/README.md)

* 1、下载   

[protobuf-3.0.0.tar.gz](https://codeload.github.com/google/protobuf/tar.gz/v3.0.0)

* 2、编译工具准备   

```shell
sudo apt-get install autoconf automake libtool curl make g++ unzip

``` 

* 3、解压   

```shell
sudo tar zxvf ./protobuf-3.0.0.tar.gz	#解压
cd ./protobuf-3.0.0/	 #解压出的文件夹
```

* 4、下载 [gmock-1.7.0.zip](http://download.csdn.net/download/qq_27888241/9951661)    

在执行 `./autogen.sh` 命令时，需要从Q外下载一个 `gmock-1.7.0.zip` 包，但是，由于网络原因下载失败，所以先提前下载。解压下载的文件，将文件夹重命名为 `gmock`，并移动到 `protobuf-3.0.0` 文件夹下。

* 5、编译安装    

```shell
cd ./protobuf-3.0.0/	 #解压出的文件夹
./autogen.sh	#首先生成configure脚本
./configure    #运行configure
make
make check
sudo make install
sudo ldconfig # refresh shared library cache.	#千万不要漏掉了 .
./configure --prefix=/usr	#更改安装到/usr
```

* 6、验证是否安装成功    

```shell
protoc --version
```


#### VLC环境变量配置

> 为VLC指定要编译的设备类型，不设置环境变量时，默认采用 `armeabi-v7a`   

打开配置文件   
```shell
sudo gedit ~/.bashrc
```   

在配置文件文本末尾输入环境变量，保存并退出   
```shell
export ANDROID_ABI=armeabi-v7a
```   

使环境变量生效   
```shell
source ~/.bashrc
```

### 编译开始

经过上面复杂的环境变量配置及编译工具安装，现在我们终于要开始真正的`VLC`源码编译了

#### vlc-andorid源码下载

* 克隆vlc-android源码到本地   

```shell
git clone https://code.videolan.org/videolan/vlc-android.git	#使用git命令从VLC官网获取最新vlc-android代码 
```    

* 克隆vlc源码到本地    

```shell
cd ./vlc-android/
git clone http://git.videolan.org/git/vlc.git vlc	#使用git命令从VLC官网获取最新vlc代码
```    

* 修改vlc-android目录下的 `build.gradle`    

```java
//将classpath 'com.android.tools.build:gradle:3.4.1'修改为下面的
classpath 'com.android.tools.build:gradle:2.3.3'
```    

* 修改vlc-android目录下的 `compile.sh` 将GRADLE标签中的配置修改如下   

```shell
read -p "skylark:press any key to start #GRADLE" skylark

if [ ! -d "gradle/wrapper" ]; then
    GRADLE_VERSION=3.4.1

    #skylark: if there is no gradle-v-all.zip,then download it.
    if [ ! -a "gradle-${GRADLE_VERSION}-all.zip" ]; then
    	diagnostic "Downloading gradle"
    	GRADLE_URL=https://download.videolan.org/pub/contrib/gradle/gradle-${GRADLE_VERSION}-bin.zip
    	wget ${GRADLE_URL} 2>/dev/null || curl -O ${GRADLE_URL}
    	checkfail "gradle: download failed"
    else
	echo "skylark:#FUNCTIONS find local gradle-${GRADLE_VERSION}-all.zip"
    fi

    unzip -o gradle-${GRADLE_VERSION}-bin.zip
    checkfail "gradle: unzip failed"

    #skylark: change gradle-v-bin.zip downloading url.
    echo "skylark: unzip done. Next step will execute gradle-${GRADLE_VERSION}/bin/gradle wrapper.This execution will lead to the downloading of [ gradle-${GRADLE_VERSION}-bin.zip ]. Notice that,you can use a faster download url in gradle-${GRADLE_VERSION}/gradle/wrapper/gradle-wrapper.properties with the value of [ distributionUrl ] AFTER canceling default downloading process (because gradle-${GRADLE_VERSION}/bin/gradle will not be created until this execution)."
    echo "Or,you can place your own [ gradle-${GRADLE_VERSION}-bin.zip ] to the location like /home/skylark/.gradle/wrapper/dists/gradle-3.3-bin/64bhckfm0iuu9gap9hg3r7ev2 , and run compile.sh again(if gradle/wrapper exists,you should remove it first to run this part shell of compile.sh)"
    read -p "Press any key to continue." skylark

    cd gradle-${GRADLE_VERSION}

    ./bin/gradle wrapper
    checkfail "gradle: wrapper failed"

    ./gradlew -version
    checkfail "gradle: wrapper failed"
    cd ..
    mkdir -p gradle
    mv gradle-${GRADLE_VERSION}/gradle/wrapper/ gradle
    mv gradle-${GRADLE_VERSION}/gradlew .
    chmod a+x gradlew
    #skylark : keep this package.
    #rm -rf gradle-${GRADLE_VERSION}-bin.zip
fi

echo "skylark : #GRADLE done."
```   

* 将项目导入到 `Android Studio`    

> 在编译过程中，脚本会去自动下载编译APK所需要的依赖包，但是由于网络原因很难下载下来。   
> 由于公司内部网络不能FQ，所以没有办法下载。但是，想到每次在使用`Android Studio`时总是可以下载下来的，于是我就将 `vlc-andorid` 项目导入到 `Android Studio` ，虽然同步失败了，显示有许多错误，但是，当再次执行 `compile.sh` 脚本时，竟然破天荒的下载成功了！ 

* 执行 `compile.sh` 脚本，开始编译   

如果你看到下面的提示，恭喜你成功了！

![](/assets/images/posts/android/vlc_android.png)

### 编译完成

> 编译成功后的APK在 `/home/skylark/projects/vlc-android/vlc-android/build/outputs/apk/VLC-Android-2.1.16-ARMv7.apk `  
> 编译成功后的aar包在 `/home/skylark/projects/vlc-android/libvlc/build/outputs/aar/libvlc-3.0.0-null.aar`

### 编译出错解决

* 如果在执行compile.sh脚本时，遇到SDK或NDK环境变量未指定，则修改compile.sh，手动写死环境变量
```shell
ANDROID_SDK=/home/skylark/Software/android-sdk
ANDROID_NDK=/home/skylark/Software/android-ndk-r13b
ANDROID_ABI=armeabi-v7a
```    

* 如果在执行compile.sh脚本时，遇到 `compile.sh: line 283: ./compile-libvlc.sh: Permission denied`
，则修改compile.sh    
```shell
#./compile-libvlc.sh $OPTS
sh compile-libvlc.sh $OPTS
```   

* 如果在执行compile.sh脚本时，遇到 `Could not resolve all dependencies for configuration ':classpath'.`
，则修改compile.sh    
```shell
#classpath 'com.android.tools.build:gradle:3.4.1'
classpath 'com.android.tools.build:gradle:2.3.3'
```

### 写在最后

以上就是如何在 Ubuntu 16.04 下编译VLC源码的步骤。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。   


### 参考资源
* <a href="http://blog.csdn.net/wkw1125/article/details/56845405" target="_blank">从零开始在Linux编译VLC-Android开源项目</a>   
* <a href="https://wiki.videolan.org/AndroidCompile/" target="_blank">VLC for Android on Linux </a>
* <a href="http://blog.csdn.net/u011365633/article/details/74278063" target="_blank">Android使用VLC库开发自己的视频播放器 </a>
* <a href="https://github.com/google/protobuf/blob/master/src/README.md" target="_blank">Protocol Buffers - Google's data interchange format </a>



转载请注明：[XueLong的博客](http://himakeit.online) » [从零开始，手把手教你如何在Ubuntu下编译VLC-Android源码](http://himakeit.online/2017/08/ubuntu-compile-vlc-android/)