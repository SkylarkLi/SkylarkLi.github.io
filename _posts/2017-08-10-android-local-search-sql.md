---
layout: post
title: Android搜索实时显示功能实现
date: 2017-08-10
tags: [Android, SQL, 搜索, ListView, ScrollView]
---

### 前言

作为一名Android开发小白，应该时刻督促自己不断的学习技术，最近遇到了一个和搜索有关的问题，就学习找时间学习了一下，**如何实现简单Android的搜索功能并可以实时预览搜索结果**，整体思路应该和平常我们见到的搜索功能差不多，所以可以直接将我的这个嵌套到你的项目中使用。 <a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a>   

先来看看效果图吧！  
![](/assets/images/posts/android/local_search.gif)

### 目录

* [实现思路](#thinking)
* [具体实现](#implementation)
* [知识点](#knowledge_point)
	* [RecordsSqliteHelper实现](#records_sqlite_open_helper)
	* [SearchSqliteHelper实现](#search_sqlite_open_helper)
	* [ListViewForScrollView实现](#listview_for_scrollview)
	* [activity_main实现](#activity_main)
	* [MainActivity实现](#main_activity)
* [写在最后](#the-end)
* [参考资源](#reference-data)

### <a name="thinking"></a>实现思路

> 首先搜索纪录应该有两种情况：  
> 1、用户直接输入的信息这个毫无疑问肯定是搜索纪录。   
> 2、用户输入完成后并没有点击搜索按钮而是直接点击了搜索结果，那么搜索结果应该也是搜索纪录。

**思路：**

- 刚进入搜索界面时，查询搜索纪录数据库，看是否有搜索纪录，有则显示搜索纪录，无则不显示。
- 当用户在搜索框中输入关键字字时，下方`listview`实时显示数据库中`模糊查询`的结果。

### <a name="implementation"></a>具体实现

- 1、初始化本地数据库
- 2、尝试从保存查询纪录的数据库中获取历史纪录并显示
- 3、使用TextWatcher实现对实时搜索
- 4、搜索及保存搜索纪录
- 5、listview的点击 做你自己的业务逻辑 

### <a name="knowledge_point"></a>知识点

> `数据库的增删改查`、`ScrollView中嵌套ListView`、`EditText的TextWatcher`、`软键盘隐藏`

**以下是代码实现：**

#### <a name="records_sqlite_open_helper"></a>RecordsSqliteHelper实现（用来操作历史纪录的）   

``` java
public class RecordsSqliteHelper extends SQLiteOpenHelper {

    private String CREATE_RECORDS_TABLE = "create table table_records(_id integer primary key autoincrement,username varchar(200),password varchar(200))";

    public RecordsSqliteHelper(Context context) {
        super(context, "records_db", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        sqLiteDatabase.execSQL(CREATE_RECORDS_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {

    }
}
```   

#### <a name="search_sqlite_open_helper"></a>SearchSqliteHelper实现（用来操作搜索查询的）   

```java
public class SearchSqliteHelper extends SQLiteOpenHelper {

    private String CREATE_TABLE = "create table table_search(_id integer primary key autoincrement,username varchar(200),password varchar(200))";

    public SearchSqliteHelper(Context context) {
        super(context, "search_db", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        sqLiteDatabase.execSQL(CREATE_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int oldVersion, int newVersion) {

    }
}
```

#### <a name="listview_for_scrollview"></a>ListViewForScrollView（一个可以兼容ScrollView的ListView）

```java
public class ListViewForScrollView extends ListView {
    public ListViewForScrollView(Context context) {
        super(context);
    }

    public ListViewForScrollView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ListViewForScrollView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    // TODO: 2017/8/9 只需要重写这一个方法就可以了，重写后可以使ListView在ScrollView中展开
    /**
     * 传入一个固定值expandSpec来绘制ListView的高。
     * http://blog.csdn.net/liaoinstan/article/details/50509122
     * @param widthMeasureSpec
     * @param heightMeasureSpec
     */
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int expandSpec = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
//        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        super.onMeasure(widthMeasureSpec, expandSpec);
    }
}
```

#### <a name="activity_main"></a>activity_main（主布局）

```xml

<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:gravity="center"
        android:orientation="horizontal">

        <EditText
            android:id="@+id/edit_search"
            android:layout_width="wrap_content"
            android:layout_height="50dp"
            android:background="@null"
            android:drawableLeft="@android:drawable/ic_menu_search"
            android:drawablePadding="8dp"
            android:gravity="center_vertical"
            android:hint="请输入关键词查询！"
            android:imeOptions="actionSearch"
            android:singleLine="true" />

        <TextView
            android:id="@+id/tv_search"
            android:layout_width="50dp"
            android:layout_height="match_parent"
            android:gravity="center"
            android:text="搜索"
            android:textSize="20sp" />
    </LinearLayout>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:paddingLeft="20dp">

                <TextView
                    android:id="@+id/tv_tip"
                    android:layout_width="match_parent"
                    android:layout_height="50dp"
                    android:gravity="left|center_vertical"
                    android:text="搜索历史" />

                <com.skylark.localsearchdemo.views.ListViewForScrollView
                    android:id="@+id/listView"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />

            </LinearLayout>

            <TextView
                android:id="@+id/tv_clear"
                android:layout_width="match_parent"
                android:layout_height="40dp"
                android:background="#F6F6F6"
                android:gravity="center"
                android:text="清除搜索历史" />
        </LinearLayout>
    </ScrollView>

</LinearLayout>

```

#### <a name="main_activity"></a>MainActivity（主方法实现）

```java
public class MainActivity extends AppCompatActivity {

    EditText mEditSearch;
    TextView mTvSearch;
    TextView mTvTip;
    ListViewForScrollView mListView;
    TextView mTvClear;

    SimpleCursorAdapter adapter;

    SearchSqliteHelper searchSqliteHelper;
    RecordsSqliteHelper recordsSqliteHelper;
    SQLiteDatabase db_search;
    SQLiteDatabase db_records;
    Cursor cursor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initView();
        initData();
        initListener();
    }

    private void initView() {
        mEditSearch = (EditText) findViewById(R.id.edit_search);
        mTvSearch = (TextView) findViewById(R.id.tv_search);
        mTvTip = (TextView) findViewById(R.id.tv_tip);
        mListView = (ListViewForScrollView) findViewById(R.id.listView);
        mTvClear = (TextView) findViewById(R.id.tv_clear);
    }

    private void initData() {
        searchSqliteHelper = new SearchSqliteHelper(this);
        recordsSqliteHelper = new RecordsSqliteHelper(this);
        // TODO: 2017/8/10 1、初始化本地数据库
        initializeData();
        // TODO: 2017/8/10 2、尝试从保存查询纪录的数据库中获取历史纪录并显示
        cursor = recordsSqliteHelper.getReadableDatabase().rawQuery("select * from table_records", null);
        adapter = new SimpleCursorAdapter(this, android.R.layout.simple_list_item_2, cursor
                , new String[]{"username", "password"}, new int[]{android.R.id.text1, android.R.id.text2}
                , CursorAdapter.FLAG_REGISTER_CONTENT_OBSERVER);
        mListView.setAdapter(adapter);
    }

    /**
     * 避免重复初始化数据
     */
    private void deleteData() {
        db_search = searchSqliteHelper.getWritableDatabase();
        db_search.execSQL("delete from table_search");
        db_search.close();
    }

    /**
     * 初始化数据
     */
    private void initializeData() {
        deleteData();
        db_search = searchSqliteHelper.getWritableDatabase();
        for (int i = 0; i < 20; i++) {
            db_search.execSQL("insert into table_search values(null,?,?)",
                    new String[]{"name" + i + 10, "pass" + i + "word"});
        }
        db_search.close();
    }

    /**
     * 初始化事件监听
     */
    private void initListener() {
        /**
         * 清除历史纪录
         */
        mTvClear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                deleteRecords();
            }
        });
        /**
         * 搜索按钮保存搜索纪录，隐藏软键盘
         */
        mTvSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //隐藏键盘
                ((InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE))
                        .hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
                //保存搜索记录
                insertRecords(mEditSearch.getText().toString().trim());

            }
        });
        /**
         * EditText对键盘搜索按钮的监听，保存搜索纪录，隐藏软件盘
         */
        // TODO: 2017/8/10 4、搜索及保存搜索纪录
        mEditSearch.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View view, int keyCode, KeyEvent keyEvent) {

                if (keyCode == KeyEvent.KEYCODE_ENTER && keyEvent.getAction() == KeyEvent.ACTION_DOWN) {
                    //隐藏键盘
                    ((InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE))
                            .hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
                    //保存搜索记录
                    insertRecords(mEditSearch.getText().toString().trim());
                }

                return false;
            }
        });
        /**
         * EditText搜索框对输入值变化的监听，实时搜索
         */
        // TODO: 2017/8/10 3、使用TextWatcher实现对实时搜索
        mEditSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @Override
            public void afterTextChanged(Editable editable) {
                if (mEditSearch.getText().toString().equals("")) {
                    mTvTip.setText("搜索历史");
                    mTvClear.setVisibility(View.VISIBLE);
                    cursor = recordsSqliteHelper.getReadableDatabase().rawQuery("select * from table_records", null);
                    refreshListView();
                } else {
                    mTvTip.setText("搜索结果");
                    mTvClear.setVisibility(View.GONE);
                    String searchString = mEditSearch.getText().toString();
                    queryData(searchString);
                }
            }
        });

        /**
         * ListView的item点击事件
         */
        // TODO: 2017/8/10 5、listview的点击 做你自己的业务逻辑 保存搜索纪录
        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
                String username = ((TextView) view.findViewById(android.R.id.text1)).getText().toString();
                String password = ((TextView) view.findViewById(android.R.id.text2)).getText().toString();
                Log.e("Skylark ", username + "---" + password);
                // TODO: 2017/8/10 做自己的业务逻辑

            }
        });

    }

    /**
     * 保存搜索纪录
     *
     * @param username
     */
    private void insertRecords(String username) {
        if (!hasDataRecords(username)) {
            db_records = recordsSqliteHelper.getWritableDatabase();
            db_records.execSQL("insert into table_records values(null,?,?)", new String[]{username, ""});
            db_records.close();
        }
    }

    /**
     * 检查是否已经存在此搜索纪录
     *
     * @param records
     * @return
     */
    private boolean hasDataRecords(String records) {

        cursor = recordsSqliteHelper.getReadableDatabase()
                .rawQuery("select _id,username from table_records where username = ?"
                        , new String[]{records});

        return cursor.moveToNext();
    }

    /**
     * 搜索数据库中的数据
     *
     * @param searchData
     */
    private void queryData(String searchData) {
        cursor = searchSqliteHelper.getReadableDatabase()
                .rawQuery("select * from table_search where username like '%" + searchData + "%' or password like '%" + searchData + "%'", null);
        refreshListView();
    }

    /**
     * 删除历史纪录
     */
    private void deleteRecords() {
        db_records = recordsSqliteHelper.getWritableDatabase();
        db_records.execSQL("delete from table_records");

        cursor = recordsSqliteHelper.getReadableDatabase().rawQuery("select * from table_records", null);
        if (mEditSearch.getText().toString().equals("")) {
            refreshListView();
        }
    }

    /**
     * 刷新listview
     */
    private void refreshListView() {
        adapter.notifyDataSetChanged();
        adapter.swapCursor(cursor);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (db_records != null) {
            db_records.close();
        }
        if (db_search != null) {
            db_search.close();
        }
    }
}
```

### <a name="the-end"></a>写在最后

第一篇技术类型博客，讲解可能不是很清楚，还存在着诸多漏洞，请多包涵。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。

<a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a>   

### <a name="reference-data"></a>参考资源
* <a href="http://blog.csdn.net/leoleohan/article/details/50688283/" target="_blank">Android搜索功能的案例，本地保存搜索历史记录</a>    


转载请注明：[XueLong的博客](http://himakeit.online) » [Android搜索实时显示功能实现](http://himakeit.online/2017/08/android-local-search-sql/)  