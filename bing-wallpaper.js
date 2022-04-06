#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');
const child_process = require('child_process');
const fetcher = require('./fetch').fetcher

const SAVE_PATH = path.join(process.env.HOME || process.env.USERPROFILE, '必应美图')

const mkdirSync = p => {
  if (p === '/') return
  try {
    fs.accessSync(p, fs.constants.W_OK)
  } catch (e) {
    mkdirSync(path.resolve(p, '..'))
    fs.mkdirSync(p)
  }
}

mkdirSync(SAVE_PATH)

const getSetWallpaperScript = () => {
  const platform = os.platform()
  switch (platform) {
    case 'darwin':
      return 'set-wallpaper.sh'
    case 'win32':
      return 'set-wallpaper.vbs'
    default:
      console.log("无法确定操作系统!")
  }
}

const setOSWallpaper = (pic_path) => {
  const script_name = getSetWallpaperScript()
  if (!script_name) {
    console.error('此系统暂无适配脚本，壁纸设置退出，Sorry...')
    return
  }
  child_process.execFileSync(path.resolve(__dirname, script_name), [pic_path])
  console.log('壁纸设置完成！');
}

const run = async () => {
  const pic_path = await fetcher(SAVE_PATH)
  setOSWallpaper(pic_path)
}

if (require.main === module) {
  run()
}
