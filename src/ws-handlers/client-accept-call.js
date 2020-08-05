const { socketIoWrapper } = require('../client-wrappers')
const { PRIVATE_USER_ROOM_PREFIX } = require('../constants')

module.exports = function enableEvent(socket) {
  socket.on('client-accept-call', async ({ data }) => {
    //forward message to caller to make a session and start communication
    //number clients who accept call may be more than 1, but number caller is alway 1
    //so forward to caller to make a unique call session
    const callerPrivateRoom = `${PRIVATE_USER_ROOM_PREFIX}${data.callerUserId}`
    const io = socketIoWrapper.getClient()
    io.to(callerPrivateRoom).emit('client-accept-call', { data })
  })
}
