const { kurentoWrapper } = require('../client-wrappers')

module.exports.getMediaById = async function getMediaById(id) {
  const client = kurentoWrapper.getClient()
  try {
    const mediaObject = await client.getMediaobjectById(id)
    return mediaObject
  } catch (error) {
    return null
  }
}

module.exports.create = async function create(type, option) {
  const client = kurentoWrapper.getClient()
  const mediaObject = await client.create(type, option)
  return mediaObject
}
