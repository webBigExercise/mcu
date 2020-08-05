const {
  GROUP_USER_ROOM_PREFIX,
  PRIVATE_USER_ROOM_PREFIX,
  CALL_TYPE_GROUP,
} = require('../constants')

//only allow client call to room
//private call (1-1) can be treat as call to room which roomName is `__private-user-room__-${user-id}`
//group call to room -> roomName is `group-${__group-user-room__-id}`
module.exports = function enableEvent(socket) {
  socket.on('client-make-call', async ({ data }) => {
    const { from, to, callerOfferSdp, callType } = data
    const room =
      callType === CALL_TYPE_GROUP
        ? `${GROUP_USER_ROOM_PREFIX}${to}`
        : `${PRIVATE_USER_ROOM_PREFIX}${to}`

    socket.broadcast.to(room).emit('client-have-incoming-call', {
      data: {
        from,
        to,
        callerOfferSdp,
        callType,
      },
    })
  })
}
