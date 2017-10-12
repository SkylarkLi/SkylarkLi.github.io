---
layout: post
title: Android自定义图形-Shape的使用
date: 2017-08-10
tags: [Android, UI, Shape, Drawable]
---

### 前言

在Android开发中我们经常要改变控件（如`Button`）的背景、颜色、样式等，通常情况下我们可以直接使用不同的图片来改变控件的样式，但是，如果使用到的图片特别多、或者比较大，就会导致我们的APK体积增大，这是非常不友好的。还好Google为我们提供了一套自定义图形的方法，也就是我们今天的主角`Shape`  <a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a>   

先来看看效果图吧！  
![](/assets/images/posts/android/drawable_shape.png)

### 目录

* [实现思路](#thinking)
* [具体实现](#implementation)
* [知识点](#knowledge_point)
* [写在最后](#the-end)
* [参考资源](#reference-data)

### <a name="thinking"></a>Shape的子属性

> shape一共有6个子属性：`solid`、`gradient`、`stroke`、`corners`、`padding`、`size`
   
| 属性 | 描述 |
| :--- | :--- |
| solid | 给shape填充背景颜色 |
| gradient | 给shape添加背景渐变 |
| stroke | 给shape添加边框 |
| corners | 给shape添加圆角 |
| padding | 给shape设置上下左右四个方向的间隔 |
| size | 给shape设置大小 |   
   
下面通过代码来逐个讲解：

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
	<!-- oval表示椭圆 -->

    <!-- 填充 -->
    <solid android:color="#ffffff" /> <!-- 定义填充的颜色值 -->

    <!-- 渐变 -->
    <gradient
        android:angle="90"
        android:endColor="#00ff00"
        android:startColor="#ff0000"
        android:type="sweep" /> <!-- 渐变属性 -->

    <!-- 描边 -->
    <stroke
        android:width="10dp"
        android:color="#0000ff"
        android:dashGap="3dp"
        android:dashWidth="5dp" /> <!-- 定义描边的宽度和描边的颜色值 -->

    <!-- 圆角 -->
    <corners
        android:bottomLeftRadius="5dp"
        android:bottomRightRadius="5dp"
        android:topLeftRadius="5dp"
        android:topRightRadius="5dp" /> <!-- 设置四个角的半径 -->

    <!-- 间隔 -->
    <padding
        android:bottom="10dp"
        android:left="10dp"
        android:right="10dp"
        android:top="10dp" /> <!-- 设置各个方向的间隔 -->

    <!-- 大小 -->
    <size
        android:width="300dp"
        android:height="200dp" /> <!-- 定义宽高 -->

</shape>
```
   
看看效果   

![](/assets/images/posts/android/drawable_shape.png)

### <a name="implementation"></a>详细讲解

- 1、shape自身属性
> `android:shape="oval"` 表示将此shape的形状设置为椭圆形   
> 可以指定的形状有四种： line线形、oval椭圆形、ring环形、rectangle距形

- 2、solid属性
> `android:color="#ffffff"` 填充的颜色，它也就只有这一个属性值

- 3、gradient（注意如果将solid的颜色设置为透明，则gradient的设置将失效）   
> `android:color="#ffffff"` 渐变开始的颜色   
> `android:endColor="#00ff00"` 渐变结束的颜色
> `android:angle="90"` 渐变角度，必须是45的整数倍   
> `android:type="sweep"` 以中心为原点360度扫描式渐变模式   
> 默认的渐变模式为 `linear` 线性渐变 ,还有一种为径向渐变 `radial` ，在使用径向渐变时还需要额外设定半径 `android:gradientRadius`    

- 4、stroke属性
> `android:width="10dp"` 描边线宽   
> `android:color="#0000ff"` 描边线的颜色   
> `android:dashWidth="5dp"` 表示'-'这样一个横线的宽度   
> `android:dashGap="3dp"` 间隔的距离

- 5、corners属性
> `android:radius` 圆角的半径，值越大角越圆   
> 还可以单独设置四个角的圆角半径 ` android:topLeftRadius` ,` android:topRightRadius` ,` android:bottomLeftRadius` ,` android:bottomRightRadius`

- 6、padding属性   
> 可以分别设置上下左右四个方向的间隔 ` android:left `,` android:top `,` android:right `,` android:bottom `

- 7、size属性    
> `android:width="300dp"` 设置shape的宽    
> `android:height="200dp"` 设置shape的高


### <a name="the-end"></a>写在最后

虽然，`shape` 的属性就只有这几个，但是，你却可以使用它们制作出很多你意向不到的效果。请开始你的表演吧！

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。

<a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a>   

### <a name="reference-data"></a>参考资源
* <a href="http://blog.csdn.net/feng88724/article/details/6398193" target="_blank">【Android UI】 Shape详解</a>    


转载请注明：[XueLong的博客](http://himakeit.online) » [Android自定义图形-Shape的使用](http://himakeit.online/2017/08/android-drawable-shape/)  