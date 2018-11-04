const http = require('http')
const app = require('./api')
require('dotenv').config()

const port = process.env.PORT || 9000

const server = http.createServer(app)

server.listen(port)
console.log('Server started!\nListing on port ' + port + ' | http://localhost:' + port)