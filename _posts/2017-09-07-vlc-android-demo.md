---
layout: post
title: 基于VLC框架的Android视频播放器Demo
date: 2017-09-07
tags: [Android, vlc]
---

### 前言

在 [从零开始，手把手教你如何在Ubuntu下编译VLC-Android源码](http://himakeit.online/2017/08/ubuntu-compile-vlc-android/) 文章中为大家讲解了如何在Ubuntu环境下编译VLC-Android源码，这篇文章就为大家讲解如何使用编译好的 `libvlc-3.0.0.aar` 包来编写一个视频播放器 <a href="https://github.com/skylarklxlong/SkylarkDemo" target="_blank">项目源代码</a>。


### 代码实现

`build.gradle` 中配置使用 `libvlc-3.0.0.aar` 包

```groovy
//---1、---
repositories{
    flatDir{
        dirs 'libs'
    }
}
dependencies {
	...
    //---2、---
    compile(name:'libvlc-3.0.0',ext:'aar')
}
```

界面布局很简单，一个FrameLayout中嵌套一个SurfaceView。    

布局实现
```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/ll_vlc"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <SurfaceView
        android:id="@+id/surface_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>

</FrameLayout>
```

Activity或者Fragment要实现 `IVLCVout.OnNewVideoLayoutListener` 接口，实现 `onNewVideoLayout`方法，在 `onNewVideoLayout` 方法中根据屏幕大小来动态控制视频播放显示区域大小。

代码实现
```java
public class VLCActivity extends BaseActivityForFullScreen implements IVLCVout.OnNewVideoLayoutListener {

    private static final String SAMPLE_URL = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";

    SurfaceView surfaceView = null;
    FrameLayout frameLayout = null;

    LibVLC mLibVLC = null;
    MediaPlayer mMediaPlayer = null;
    IVLCVout mIVLCVout = null;

    View.OnLayoutChangeListener onLayoutChangeListener = null;
    Handler handler = new Handler();

    int mVideoHeight = 0;
    int mVideoWidth = 0;
    int mVideoVisibleHeight = 0;
    int mVideoVisibleWidth = 0;
    int mVideoSarNum = 0;
    int mVideoSarDen = 0;

    static final int SURFACE_BEST_FIT = 0;
    static final int SURFACE_FIT_SCREEN = 1;
    static final int SURFACE_FILL = 2;
    static final int SURFACE_16_9 = 3;
    static final int SURFACE_4_3 = 4;
    static final int SURFACE_ORIGINAL = 5;
    static int CURRENT_SIZE = SURFACE_BEST_FIT;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vlc);

        surfaceView = (SurfaceView) findViewById(R.id.surface_view);
        frameLayout = (FrameLayout) findViewById(R.id.ll_vlc);

        mLibVLC = new LibVLC(this);
        mMediaPlayer = new MediaPlayer(mLibVLC);

        mIVLCVout = mMediaPlayer.getVLCVout();
        if (surfaceView != null) {
            mIVLCVout.setVideoView(surfaceView);
        }
        mIVLCVout.attachViews();
        Media media = new Media(mLibVLC, Uri.parse(SAMPLE_URL));
        mMediaPlayer.setMedia(media);
        media.release();
        mMediaPlayer.play();

        if (onLayoutChangeListener == null) {
            onLayoutChangeListener = new View.OnLayoutChangeListener() {
                private final Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        updateVideoSurfaces();
                    }
                };

                @Override
                public void onLayoutChange(View view, int left, int top, int right,
                                           int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {
                    if (left != oldLeft || top != oldTop || right != oldRight || bottom != oldBottom) {
                        handler.removeCallbacks(runnable);
                        handler.post(runnable);
                    }
                }
            };
        }
        frameLayout.addOnLayoutChangeListener(onLayoutChangeListener);
    }

    private void changeMediaPlayerLayout(int displayW, int displayH) {
        /* Change the video placement using the MediaPlayer API */
        switch (CURRENT_SIZE) {
            case SURFACE_BEST_FIT:
                mMediaPlayer.setAspectRatio(null);
                mMediaPlayer.setScale(0);
                break;
            case SURFACE_FIT_SCREEN:
            case SURFACE_FILL: {
                Media.VideoTrack vtrack = mMediaPlayer.getCurrentVideoTrack();
                if (vtrack == null)
                    return;
                final boolean videoSwapped = vtrack.orientation == Media.VideoTrack.Orientation.LeftBottom
                        || vtrack.orientation == Media.VideoTrack.Orientation.RightTop;
                if (CURRENT_SIZE == SURFACE_FIT_SCREEN) {
                    int videoW = vtrack.width;
                    int videoH = vtrack.height;

                    if (videoSwapped) {
                        int swap = videoW;
                        videoW = videoH;
                        videoH = swap;
                    }
                    if (vtrack.sarNum != vtrack.sarDen)
                        videoW = videoW * vtrack.sarNum / vtrack.sarDen;

                    float ar = videoW / (float) videoH;
                    float dar = displayW / (float) displayH;

                    float scale;
                    if (dar >= ar)
                        scale = displayW / (float) videoW; /* horizontal */
                    else
                        scale = displayH / (float) videoH; /* vertical */
                    mMediaPlayer.setScale(scale);
                    mMediaPlayer.setAspectRatio(null);
                } else {
                    mMediaPlayer.setScale(0);
                    mMediaPlayer.setAspectRatio(!videoSwapped ? "" + displayW + ":" + displayH
                            : "" + displayH + ":" + displayW);
                }
                break;
            }
            case SURFACE_16_9:
                mMediaPlayer.setAspectRatio("16:9");
                mMediaPlayer.setScale(0);
                break;
            case SURFACE_4_3:
                mMediaPlayer.setAspectRatio("4:3");
                mMediaPlayer.setScale(0);
                break;
            case SURFACE_ORIGINAL:
                mMediaPlayer.setAspectRatio(null);
                mMediaPlayer.setScale(1);
                break;
        }
    }

    private void updateVideoSurfaces() {
        int sw = getWindow().getDecorView().getWidth();
        int sh = getWindow().getDecorView().getHeight();

        // sanity check
        if (sw * sh == 0) {
            return;
        }

        mMediaPlayer.getVLCVout().setWindowSize(sw, sh);

        ViewGroup.LayoutParams lp = surfaceView.getLayoutParams();
        if (mVideoWidth * mVideoHeight == 0) {
            /* Case of OpenGL vouts: handles the placement of the video using MediaPlayer API */
            lp.width = ViewGroup.LayoutParams.MATCH_PARENT;
            lp.height = ViewGroup.LayoutParams.MATCH_PARENT;
            surfaceView.setLayoutParams(lp);
            lp = frameLayout.getLayoutParams();
            lp.width = ViewGroup.LayoutParams.MATCH_PARENT;
            lp.height = ViewGroup.LayoutParams.MATCH_PARENT;
            frameLayout.setLayoutParams(lp);
            changeMediaPlayerLayout(sw, sh);
            return;
        }

        if (lp.width == lp.height && lp.width == ViewGroup.LayoutParams.MATCH_PARENT) {
            /* We handle the placement of the video using Android View LayoutParams */
            mMediaPlayer.setAspectRatio(null);
            mMediaPlayer.setScale(0);
        }

        double dw = sw, dh = sh;
        final boolean isPortrait = getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT;

        if (sw > sh && isPortrait || sw < sh && !isPortrait) {
            dw = sh;
            dh = sw;
        }

        // compute the aspect ratio
        double ar, vw;
        if (mVideoSarDen == mVideoSarNum) {
            /* No indication about the density, assuming 1:1 */
            vw = mVideoVisibleWidth;
            ar = (double) mVideoVisibleWidth / (double) mVideoVisibleHeight;
        } else {
            /* Use the specified aspect ratio */
            vw = mVideoVisibleWidth * (double) mVideoSarNum / mVideoSarDen;
            ar = vw / mVideoVisibleHeight;
        }

        // compute the display aspect ratio
        double dar = dw / dh;

        switch (CURRENT_SIZE) {
            case SURFACE_BEST_FIT:
                if (dar < ar)
                    dh = dw / ar;
                else
                    dw = dh * ar;
                break;
            case SURFACE_FIT_SCREEN:
                if (dar >= ar)
                    dh = dw / ar; /* horizontal */
                else
                    dw = dh * ar; /* vertical */
                break;
            case SURFACE_FILL:
                break;
            case SURFACE_16_9:
                ar = 16.0 / 9.0;
                if (dar < ar)
                    dh = dw / ar;
                else
                    dw = dh * ar;
                break;
            case SURFACE_4_3:
                ar = 4.0 / 3.0;
                if (dar < ar)
                    dh = dw / ar;
                else
                    dw = dh * ar;
                break;
            case SURFACE_ORIGINAL:
                dh = mVideoVisibleHeight;
                dw = vw;
                break;
        }

        // set display size
        lp.width = (int) Math.ceil(dw * mVideoWidth / mVideoVisibleWidth);
        lp.height = (int) Math.ceil(dh * mVideoHeight / mVideoVisibleHeight);
        surfaceView.setLayoutParams(lp);

        // set frame size (crop if necessary)
        lp = frameLayout.getLayoutParams();
        lp.width = (int) Math.floor(dw);
        lp.height = (int) Math.floor(dh);
        frameLayout.setLayoutParams(lp);

        surfaceView.invalidate();
    }

    @Override
    public void onNewVideoLayout(IVLCVout vlcVout, int width, int height, int visibleWidth,
                                 int visibleHeight, int sarNum, int sarDen) {
        mVideoWidth = width;
        mVideoHeight = height;
        mVideoVisibleWidth = visibleWidth;
        mVideoVisibleHeight = visibleHeight;
        mVideoSarNum = sarNum;
        mVideoSarDen = sarDen;
        updateVideoSurfaces();
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (onLayoutChangeListener != null) {
            frameLayout.removeOnLayoutChangeListener(onLayoutChangeListener);
            onLayoutChangeListener = null;
        }

        mMediaPlayer.stop();

        mMediaPlayer.getVLCVout().detachViews();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mMediaPlayer.release();
        mLibVLC.release();
    }
}

```


### 写在最后

以上就是如何使用`libvlc-3.0.0.aar`包来实现自己的视频播放器。

如果你在参考过程中遇到问题，可以在我的联系方式中给我提问。

后面会继续介绍，Android的相关知识，欢迎继续关注我博客的更新。  


转载请注明：[XueLong的博客](http://himakeit.online) » [基于VLC框架的Android视频播放器Demo](http://himakeit.online/2017/09/vlc-android-demo/)