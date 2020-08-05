const { redisWrapper } = require('../client-wrappers')

module.exports.push = async function push(endpointId, candidate) {
  const redisClient = redisWrapper.getClient()
  const serialized =
    typeof candidate === 'string' ? candidate : JSON.stringify(candidate)

  await redisClient.rpushPromise(endpointId, serialized)
}
