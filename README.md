# Bing壁纸相关脚本

主要包含获取必应壁纸及winOS/macOS系统设置壁纸的脚本


## bing-wallpaper.js

基于`nodejs`的获取、设置壁纸的全自动脚本，需要调用`set-wallpaper.sh/set-wallpaper.vbs`。

壁纸默认保存在用户`HOME目录`。

## set-wallpaper.sh/.vbs

设置系统壁纸的脚本，需要传入壁纸地址，可以指定本地/URL地址。


## fetch.js

获取Bing壁纸并保存到本地的脚本，需要传入保存地址目录

## server.js

简单的壁纸服务器脚本，通过指定目录快速建立壁纸服务器。支持两种url：`/random`和`latest`。
