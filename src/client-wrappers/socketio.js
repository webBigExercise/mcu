const socketIO = require('socket.io')
const redisAdapter = require('socket.io-redis')

let _io = null

module.exports.connect = function connect(server, adapterOption) {
  const io = socketIO(server)
  io.adapter(redisAdapter(adapterOption))

  console.log(
    `Socket io is started with adapterOption: ${JSON.stringify(adapterOption)}`
  )
  _io = io
  return _io
}

module.exports.getClient = function getClient() {
  if (!_io) throw new Error('Socketio is not connected')

  return _io
}
