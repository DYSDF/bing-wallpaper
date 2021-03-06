#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const request = options => {
  return new Promise((resolve, reject) => {
    https.get(options, res => {
      const chunks = []
      let totalSize = 0
      res.on('data', chunk => {
        chunks.push(chunk)
        totalSize += chunk.length
      })
      res.on('end', () => {
        let chunkCount = chunks.length
        if (chunkCount === 0) {
          resolve(Buffer.alloc(0))
        } else if (chunkCount === 1) {
          resolve(chunks[0])
        } else {
          const buffer = Buffer.alloc(totalSize);
          for (var i = 0, pos = 0, l = chunkCount; i < l; i++) {
            const chunk = chunks[i]
            chunk.copy(buffer, pos)
            pos += chunk.length
          }
          resolve(buffer)
        }
      })
    }).on('error', e => {
      reject(e)
    })
  })
}

const getWallpaperData = async () => {
  const options = {
    protocol: 'https:',
    hostname: 'www.bing.com',
    path: `/HPImageArchive.aspx?format=js&idx=0&n=1`,
    method: 'GET',
  }
  const buffer = await request(options);
  const resText = buffer.toString('utf-8');
  try {
    const res = JSON.parse(resText);
    if (res.images && res.images.length) {
      const imgInfo = res.images[0];
      return {
        url: imgInfo.url,
        copyright: imgInfo.copyright,
        date: imgInfo.enddate
      };
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject(err);
  }
}

const requestWallpaper = url => {
  const ops = {
    protocol: 'https:',
    hostname: 'cn.bing.com',
    path: url,
    method: 'GET',
  }
  return request(ops)
}

const saveWallpaper = (file_path, buffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file_path, buffer, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(file_path)
      }
    })
  })
}

const fetcher = async (save_dir, count = 0) => {
  try {
    const stats = fs.statSync(save_dir)
    if (!stats.isDirectory()) throw new Error('save path is not directory')

    console.log('????????????bing????????????')
    const { url, date, copyright = '' } = await getWallpaperData()
    console.log('??????bing??????????????????')

    console.log('????????????bing??????')
    const pic_name = `${date}-${copyright.replace(/ \(.*?\)/g, '')}.jpg`
      .replace(/["\\\/\|\?\*\<\>]/g, '')
    const pic_buffer = await requestWallpaper(url);
    const pic_path = path.join(save_dir, pic_name)
    await saveWallpaper(pic_path, pic_buffer);
    console.log(`?????????????????????${pic_path}`);
    return pic_path
  } catch (e) {
    console.error('?????????????????????%o', e)
    if (count >= 5) {
      console.log('??????????????????????????????????????????????????????sorry');
      process.exit(1)
    }
    console.log(`5s???????????????`)
    setTimeout(() => fetcher(save_dir, count + 1), 5000)
  }
}

if (require.main === module) {
  const SAVE_PATH = process.argv[2]
  if (!SAVE_PATH) throw new Error('save path is not set')
  fetcher(SAVE_PATH)
}

module.exports = {
  fetcher
}
