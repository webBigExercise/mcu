const { redisWrapper } = require('../client-wrappers')
const repoPrefixKey = '__call-session__'

module.exports.get = async function get(id) {
  const redisClient = redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  const session = await redisClient.hgetallPromise(key)

  if (!session) return null
  return {
    ...session,
    userIds: session.userIds.split(','),
  }
}

module.exports.create = async function create({ id, pipelineId, userIds }) {
  const redisClient = redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  await redisClient.hmsetPromise(
    key,
    'id', id,
    'pipelineId', pipelineId || '',
    'userIds', userIds.join(',') || ''
  )
}

module.exports.remove = async function remove(id) {
  const redisClient = redisWrapper.getClient()
  const key = `${repoPrefixKey}${id}`
  await redisClient.delPromise(key)
}

module.exports.removeUserId = async function removeUserId(sessionId, userId) {
  const redisClient= redisWrapper.getClient()
  const key = `${repoPrefixKey}${sessionId}`
  const oldUserIds = await redisClient.hgetPromise(key, 'userIds')
  const newUserIds = oldUserIds
    .split(',')
    .filter(i => i !== userId)
    .join(',')

  await redisClient.hsetPromise(key, 'userIds', newUserIds)
}
