const kurento = require('kurento-client')

let _client = null

module.exports.connect = async function connect(url, options) {
  const client = await kurento(url, options)
  console.log(
    `Kurento client is listen on ${url} with option: ${JSON.stringify(options)}`
  )
  _client = client
  return _client
}

module.exports.getClient = function getClient() {
  if (!_client) throw new Error('Kurento is not connected')

  return _client
}
