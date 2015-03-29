#!/usr/bin/env node

var split = require('split')
var http = require('http')
var getport = require('get-port')
var open = require('open')
var fs = require('fs')
var path = require('path')

process.stdin.setEncoding('utf-8')

getport(hasPort)

function hasPort(err, port) {
  if(err) return console.error(err)
  http
    .createServer(request)
    .listen(port, ready)
  function ready() {
    console.log('Listening on port ' + port) 
    open('http://localhost:' + port)
  }
}

function request(req, res) {
  if(req.url === '/sse') {
    res.setHeader('content-type', 'text/event-stream')
      process.stdin
        .pipe(split())
        .on('data', function (chunk) {
          if(chunk.length === 0) return
          res.write('data: ' + chunk + '\n\n')
        })
        .on('end',function () {
          res.end()
        })
  } else {
    // index.html
    res.setHeader('content-type', 'text/html')
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res)
  }
}


