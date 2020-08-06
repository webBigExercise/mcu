const _ = require('lodash')
const { redisWrapper } = require('../client-wrappers')
const repoPrefixKey = '__user-session__'

module.exports.get = async function get(id) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  const session = await redisClient.hgetallPromise(key)

  return session
}

module.exports.create = async function create({ id, webRtcEndpointId, hubportEndpointId }) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  await redisClient.hmsetPromise(
    key,
    'id', id,
    'webRtcEndpointId', webRtcEndpointId || '',
    'hubportEndpointId', hubportEndpointId || ''
  )
}

module.exports.set = async function set(id, overrides) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`

  const sanitizedChanges = _.flatten(_.entries(overrides)).map(i => i || '') //null -> ''
  await redisClient.hmsetPromise(key, ...sanitizedChanges)
}

module.exports.remove = async function remove(id) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  await redisClient.delPromise(key)
}
