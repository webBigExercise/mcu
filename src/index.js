const https = require('https')
const config = require('config')
const fs = require('fs')
const kurento = require('kurento-client')
const socketIO = require('socket.io')
const socketIoRedisAdapter = require('socket.io-redis')

const PORT = config.get('port')
const HOSTNAME = config.get('host')
const HTTPS_KEY_PATH = config.get('https.keyDir')
const HTTPS_CERT_PATH = config.get('https.certDir')
const KURENTO_URL = config.get('kurento.url')
const KURENTO_OPTION = config.get('kurento.option')
const REDIS_HOST = config.get('redis.host')
const REDIS_PORT = config.get('redis.port')

const server = https.createServer({
  key: fs.readFileSync(HTTPS_KEY_PATH),
  cert: fs.readFileSync(HTTPS_CERT_PATH),
})

const io = socketIO(server)
io.adapter(socketIoRedisAdapter({ host: REDIS_HOST, port: REDIS_PORT }))

global.io = io

kurento(KURENTO_URL, KURENTO_OPTION).then((client) => {
  console.log(
    `Kurento client is listen on ${KURENTO_URL} with option: ${JSON.stringify(KURENTO_OPTION)}`
  )
  global.kurentoClient = client
})

server.listen(PORT, HOSTNAME, () =>
  console.log(`Server is started on ${HOSTNAME}:${PORT}`)
)
