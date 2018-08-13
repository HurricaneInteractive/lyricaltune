var express = require('express')
var path = require('path')

var app = express()

app.get('/', function(req, res) {
    res.send('hello world');
})

app.listen('3000')
console.info('==> Listening on 3000. Open up http://localhost:3000/ in your browser.');