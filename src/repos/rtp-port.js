const config = require('config')
const { redisWrapper } = require('../client-wrappers')
const repoPrefixKey = '__rtp-port__'

module.exports.getCurrent = async function getCurrent() {
  const redisClient = redisWrapper.getClient()
  const resp = await redisClient.hgetallPromise(repoPrefixKey)
  if (!resp) return null

  return {
    audioPort: parseInt(resp.audioPort),
    videoPort: parseInt(resp.videoPort),
  }
}

module.exports.increase = async function increase() {
  const redisClient = redisWrapper.getClient()
  const { audioPort, videoPort } = await this.getCurrent()
  const incrConst = 2

  await redisClient.hmsetPromise(repoPrefixKey,
    'audioPort', audioPort + incrConst,
    'videoPort', videoPort + incrConst
  )
}

module.exports.init = async function init() {
  const redisClient = redisWrapper.getClient()
  const cur = await this.getCurrent()
  if (cur) return

  const audioStartPort = config.get('rtp.audioPortStart')
  const videoStartPort = config.get('rtp.videoPortStart')

  await redisClient.hmsetPromise(repoPrefixKey,
    'audioPort', audioStartPort,
    'videoPort', videoStartPort
  )
}
