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
  _client.hmsetPromise = promisify(_client.hmset).bind(_client) //hash set many
  _client.hsetPromise = promisify(_client.hset).bind(_client) //hash set
  _client.hgetallPromise = promisify(_client.hgetall).bind(_client) //hash get
  _client.hgetPromise = promisify(_client.hget).bind(_client)
  return _client
}
