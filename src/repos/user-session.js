const { redisWrapper } = require('../client-wrappers')
const repoPrefixKey = '__user-session__'

module.exports.get = async function get(id) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  const session = await redisClient.hgetallPromise(key)

  return session
}

module.exports.create = async function create({ id, webRtcEndpointId }) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  await redisClient.hmsetPromise(
    key,
    'id', id,
    'webRtcEndpointId', webRtcEndpointId || '',
  )
}

module.exports.remove = async function remove(id) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  await redisClient.delPromise(key)
}
