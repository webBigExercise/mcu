const { redisWrapper } = require('../client-wrappers')
const repoPrefixKey = '__candidate_queue__'

module.exports.push = async function push(endpointStoredKey, candidate) {
  const redisClient = redisWrapper.getClient()
  const serialized =
    typeof candidate === 'string' ? candidate : JSON.stringify(candidate)
  const key = `${repoPrefixKey}${endpointStoredKey}`

  await redisClient.rpushPromise(key, serialized)
  return key
}

module.exports.listAll = async function listAll(endpointStoredKey) {
  const redisClient = redisWrapper.getClient()
  const key = `${repoPrefixKey}${endpointStoredKey}`
  const candidates = await redisClient.lrangePromise(key, 0, -1)

  return candidates || []
}

module.exports.remove = async function remove(endpointStoredKey) {
  const redisClient = redisWrapper.getClient()
  const key = `${repoPrefixKey}${endpointStoredKey}`

  await redisClient.delPromise(key)
  return key
}
