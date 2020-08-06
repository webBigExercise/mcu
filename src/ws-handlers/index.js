const { socketIoWrapper } = require('../client-wrappers')
const { userSessionRepo } = require('../repos')
const { PRIVATE_USER_ROOM_PREFIX } = require('../constants')
const enableEventClientMakeCall = require('./client-make-call')
const enableEventClientAcceptCall = require('./client-accept-call')
const enableEventClientSendIceCandidate = require('./client-send-ice-candidate')
const enableEventStopCall = require('./stop-call')
const enableEventJoinRoom = require('./join-room')
const enableEventServerStartCallSession = require('./server-start-call-session')

const io = socketIoWrapper.getClient()

io.on('connection', (socket) => {
  //TODO: change later by real user identification like username or real user's id
  const userId = socket.id
  const privateUserRoom = `${PRIVATE_USER_ROOM_PREFIX}${userId}`
  const userSession = { id: userId, webRtcEndpointId: null, hubportEndpointId: null }

  socket.join(privateUserRoom)
  userSessionRepo.create(userSession)

  enableEventClientMakeCall(socket)
  enableEventClientAcceptCall(socket)
  enableEventClientSendIceCandidate(socket)
  enableEventStopCall(socket)
  enableEventJoinRoom(socket)
  enableEventServerStartCallSession(socket)
})
