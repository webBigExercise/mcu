const https = require('https')
const config = require('config')
const fs = require('fs')

const app = require('./app')
const {
  kurentoWrapper,
  socketIoWrapper,
  redisWrapper,
} = require('./client-wrappers')

const PORT = config.get('port')
const HOSTNAME = config.get('host')
const HTTPS_KEY_PATH = config.get('https.keyDir')
const HTTPS_CERT_PATH = config.get('https.certDir')
const KURENTO_URL = config.get('kurento.url')
const KURENTO_OPTION = config.get('kurento.option')
const REDIS_HOST = config.get('redis.host')
const REDIS_PORT = config.get('redis.port')
const REDIS_OPTION = config.get('redis.option')

const httpsOptions = {
  key: fs.readFileSync(HTTPS_KEY_PATH),
  cert: fs.readFileSync(HTTPS_CERT_PATH),
}
const server = https.createServer(httpsOptions, app)

redisWrapper.connect(REDIS_HOST, REDIS_PORT, REDIS_OPTION)
kurentoWrapper.connect(KURENTO_URL, KURENTO_OPTION)
socketIoWrapper.connect(server, { host: REDIS_HOST, port: REDIS_PORT })

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is started on ${HOSTNAME}:${PORT}`)
  require('./ws-handlers')
})
