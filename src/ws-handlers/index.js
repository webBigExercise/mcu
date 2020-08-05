const { socketIoWrapper } = require('../client-wrappers')
const { PRIVATE_USER_ROOM_PREFIX } = require('../constants')
const enableEventClientMakeCall = require('./client-make-call')
const enableEventClientAcceptCall = require('./client-accept-call')
const enableEventClientSendIceCandidate = require('./client-send-ice-candidate')
const enableEventStopCall = require('./stop-call')
const enableEventJoinRoom = require('./join-room')

const io = socketIoWrapper.getClient()

io.on('connection', (socket) => {
  //TODO: change later by real user identification like username or real user's id
  const userId = socket.id
  const privateUserRoom = `${PRIVATE_USER_ROOM_PREFIX}${userId}`
  socket.join(privateUserRoom)

  enableEventClientMakeCall(socket)
  enableEventClientAcceptCall(socket)
  enableEventClientSendIceCandidate(socket)
  enableEventStopCall(socket)
  enableEventJoinRoom(socket)
})
