---
layout: post
title: Android 数据库SQLite使用小结
date: 2017-08-25
tags: [Android, sqlite, 数据库]
---

### 前言

在Android开发过程中，对于数据的存储，我们或多或少的都会使用到数据库相关的操作，所以在此小小的总结一下，Android中使用SQLite数据库的技巧和方法，算是自己对数据库知识的复习。<a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a> 
   
### 增删改查

> adb shell中操作SQLite   

```java
adb shell
su	//以管理员的身份运行命令
sqlite DATABASE_NAME.db	//进入要操作的数据库
.table	//查看当前数据库有哪些表
.table t% //".tables"命令后也可以跟一参数，它是一个pattern，这样命令就只列出表名和该参数匹配的表。
.schema //显示最初用于创建数据库的CREATE TABLE和CREATE INDEX的SQL语句
.schema t% //".schema"命令可以包含一个参数，它是一个pattern，用于对表进行过滤，这时只会显示满足条件的表和所有索引的SQL语句
pragma table_info(TABLE_NAME);	//查看表的数据结构
.mode line	//切换显示模式，可用参数有 line list column
.separator |   //字段之间使用 | 间隔开
.output filename.txt  //将数据库中的数据输出到文件中
.width 12 6 //调整列宽 12表示第一列宽为12，6表示第二列宽为6
.databases //显示所有当前连接打开的数据库的一个列表,main：最初打开的数据库，temp：临时表的数据库
.exit //退出
```

> 小技巧   

* 在[SQLite EXpert Personal](http://www.sqliteexpert.com/download.html) 中注释SQL语句，单行注释使用-- ，多行注释使用/**/
* 每个 `SQLite` 数据库中都有一个隐藏的 `sqlite_master` 表，它记载了当前数据库中所有的建表语句。
* 在对数据库进行增删改查前首先需要先调用`SQLiteOpenHelper`的`getReadableDatabase()`（查时调用）或`getWritableDatabase()`（增删改时调用）方法。

#### 常规的SQL语句操作

```java
SQLiteDatabase db = null;
//在执行增删改语句时使用
db = helper.getWritableDatabase();
//在执行查询语句时使用
//db = helper.getReadableDatabase();
db.execSQL("在这里填入你的SQL语句");
```    
> 常用的SQL语句如下:   

```java
//建表语句
create table if not exists TABLE_NAME(Id integer orimary key,Name text,Age integer);
//增加一条数据
insert into TABLE_NAME(Id,Name,Age) values (1,'lixuelong',23);
//删除一条数据
delete from TABLE_NAME where Name = 'lixuelong';
//修改一条数据
update TABLE_NAME set Name = 'xuelong' where Id =1;
//查询语句
select * from TABLE_NAME where Name = 'lixuelong' order by Age desc;
//统计查询语句
select count(Id) from TABLE_NAME where Age = 18;
//比较查询语句
select Id,Name,Max(Age) as Age from TABLE_NAME;
```

#### Android自有的事务（`Transaction`）处理方法

> 增加数据操作   
> long insertOrThrow(String table, String nullColumnHack, ContentValues values)   
> 无论第三个参数是否包含数据，执行此方法必定会插入一条数据   
    
* table：表名
* nullColumnHack：用于指定空值字段的名称
* values：要存放的ContentValues对象，可以为null
* 返回值：返回新添记录的行号，与主键id无关,发生错误返回-1

```java
SQLiteDatabase db = null;
db = helper.getWritableDatabase();
db.beginTransaction();
// insert into TABLE_NAME (_id,Name,Age) values (6,'张三',18);
ContentValues contentValues = new ContentValues();
contentValues.put("_id","6");
contentValues.put("Name", "张三");
contentValues.put("Age", 18);
db.insertOrThrow(TABLE_NAME, null, contentValues);
db.setTransactionSuccessful();
```

> 删除数据操作   
> int delete(String table, String whereClause, String[] whereArgs)   
   
* table：表名
* whereClause：删除的条件，如果为null，则整行删除
* whereArgs：字符串数组，和whereClause配合使用，有两种使用方法，1、如果whereClause的条件已经直接给出，如"Name='张三'"，则whereArgs可以设为null。2、如果whereClause的条件没有直接给出，如"Name=?"，则？会被whereArgs字符串数组中的值代替。   
* 返回值：0：删除是被，1：删除成功

```java
SQLiteDatabase db = null;
db = helper.getWritableDatabase();
db.beginTransaction();
db.delete(TABLE_NAME, "Name=?", new String[]{"张三"});
//db.execSQL("delete from TABLE_NAME where Name = '张三';");
db.setTransactionSuccessful();
```

> 修改数据操作   
> update(String table, ContentValues values, String whereClause, String[] whereArgs)
   
* table：表名
* values：要存放的ContentValues对象，可以为null
* whereClause：修改的条件，如果为null，则整行修改
* whereArgs：字符串数组，和whereClause配合使用，有两种使用方法，1、如果whereClause的条件已经直接给出，如"Name='张三'"，则whereArgs可以设为null。2、如果whereClause的条件没有直接给出，如"Name=?"，则？会被whereArgs字符串数组中的值代替。
* 返回值：the number of rows affected

```java
SQLiteDatabase db = null;
db = helper.getWritableDatabase();
db.beginTransaction();
// update TABLE_NAME set Name = 'zhangsan' where Name = '张三'
ContentValues contentValues = new ContentValues();
contentValues.put("Name", "zhangsan");
db.update(TABLE_NAME, contentValues, "Name = ?", new String[]{"张三"});
db.setTransactionSuccessful();
```

> 查询数据操作   
> query(String table, String[] columns, String selection, String[] selectionArgs, String groupBy, String having, String orderBy)    
> query方法较多，这里只列举一个，有兴趣的朋友可以自行研究
   
* table：表名
* columns：需要返回的列的列表，如果为null，则返回全部的列
* selection：查询的条件，符合什么条件的行将返回。如果为null，则这个表里的所有行都将返回。其两种用法和update里的一样
* selectionArgs：用法和update里的一样
* groupBy：用于控制分组
* having：用于对分组进行过滤
* orderBy：用于对记录进行排序
* 返回值：Cursor对象

```java
SQLiteDatabase db = null;
Cursor cursor = null;
db = helper.getWritableDatabase();
// select * from TABLE_NAME where Age = 18
cursor = db.query(TABLE_NAME, TABLE_COLUMNS, "Age = ?", new String[]{String.valueOf(18)},null, null, null);
if (cursor.getCount() > 0) {
   List<DBSQLBean> beanList = new ArrayList<DBSQLBean>();
   while (cursor.moveToNext()) {
        DBSQLBean bean = parseBean(cursor);
        beanList.add(bean);
    }
    return beanList;
}
```

> 统计查询数据操作   

```java
int count = 0;
SQLiteDatabase db = null;
Cursor cursor = null;
db = helper.getWritableDatabase();
// select count(_id) from TABLE_NAME where Age = 18
cursor = db.query(DBSQLHelper.TABLE_NAME, new String[]{"COUNT(_id)"},"Age = ?", new String[]{String.valueOf(18)},null, null, null);
if (cursor.moveToFirst()) {
    count = cursor.getInt(0);
}
```

> 比较查询数据操作   

```java
SQLiteDatabase db = null;
Cursor cursor = null;
db = helper.getWritableDatabase();
// select _id,Name,Max(Age) as Age from TABLE_NAME
cursor = db.query(DBSQLHelper.TABLE_NAME, new String[]{"_id", "Name","Max(Age) as Age"},null, null, null, null, null);
if (cursor.getCount() > 0) {
    if (cursor.moveToFirst()) {
        return parseBean(cursor);
    }
}
```

### 写在最后

以上就是对Android中数据库操作的小小总结。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。   

<a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a> 

### 参考资源
* <a href="http://www.jianshu.com/p/5c33be6ce89d" target="_blank">Android SQLite详解</a>   
* <a href="http://blog.csdn.net/tanjunjie621/article/details/6775912" target="_blank">android笔记 SQLiteDatabase的几个重要方法的参数列表 </a>



转载请注明：[XueLong的博客](http://himakeit.online) » [Android 数据库SQLite使用小结](http://himakeit.online/2017/08/android-sqlite/)