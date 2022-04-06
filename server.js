#!/usr/bin/env node

const fs = require('fs')
const http = require('http')

const STATIC_DIR = process.argv[2]
if (!STATIC_DIR) throw new Error('http server path is not set')

const stats = fs.statSync(STATIC_DIR)
if (!stats.isDirectory()) throw new Error('http server path is not directory')

const resolve = (...paths) => require("path").resolve(STATIC_DIR, ...paths)

const server = http.createServer()

const cache_map = new Map()
const getFiles = () => {
  let cache = cache_map.get('files')
  const now = Date.now()
  if (!cache || cache.expire < now) {
    const files = fs.readdirSync(resolve('./')).filter(n => n.endsWith('.jpg')).sort()
    cache = {
      files: JSON.stringify(files),
      expire: now + 24 * 3600 * 1000
    }
    cache_map.set('files', cache)
  }
  return JSON.parse(cache.files)
}

server.on('request', function(req, res) {
  if (req.url === '/random') {
    const files = getFiles()
    const img_count = files.reduce(function (acc, name) {
      if (name.endsWith('.jpg')) acc += 1
      return acc
    }, 0)
    res.setHeader('content-type', 'image/jpeg')
    const random_index = Math.ceil(Math.random() * img_count)
    const file_name = files[random_index]
    const read_stream = fs.createReadStream(resolve(file_name))
    return read_stream.pipe(res)
  } else if (req.url === '/latest') {
    const files = getFiles()
    const file_name = files.pop()

    if (!file_name) {
      res.statusCode = 404
      return res.end('NotFound')
    }

    res.setHeader('content-type', 'image/jpeg')
    const read_stream = fs.createReadStream(resolve(file_name))
    return read_stream.pipe(res)
  }
  res.statusCode = 404
  return res.end('NotFound')
})
server.listen(8080, function() {
  console.log('Server running at 8080')
})
