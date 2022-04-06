#!/bin/sh

# input path/url check
if [ ! -n "$1" ]; then
  echo "未传入图片地址/url，执行退出"
  exit 1
fi

pic_path=$1

if [ -n "$(curl -s -m 5 -IL $1 | grep 200)" ]; then
  pic_path="/tmp/$(jot -r 1 10000000 99999999).jpg"
  curl -o $pic_path $1
fi

osascript -e "tell application \"System Events\" to tell every desktop to set picture to \"$pic_path\" as POSIX file"
