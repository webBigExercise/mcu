const redis = require('redis')
const { promisify } = require('util')

let _client

module.exports.connect = async function connect(host, port, option) {
  _client = redis.createClient(port, host, option)
  console.log(
    `Redis is listen on ${host}:${port} with option ${JSON.stringify(option)}`
  )
}

module.exports.getClient = function getClient() {
  if (!_client) throw new Error('Redis store is not connected')

  _client.rpushPromise = promisify(_client.rpush).bind(_client)
  _client.lrangePromise = promisify(_client.lrange).bind(_client)
  _client.delPromise = promisify(_client.del).bind(_client)
  return _client
}
