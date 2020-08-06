const { socketIoWrapper } = require('../client-wrappers')
const {
  callSessionRepo,
  kurentoMediaRepo,
  userSessionRepo,
} = require('../repos')
const {
  CALL_TYPE_PRIVATE,
  GROUP_USER_ROOM_PREFIX,
  PRIVATE_USER_ROOM_PREFIX,
} = require('../constants')

module.exports = function enableEvent(socket) {
  socket.on('client-leave', async ({ data }) => {
    const callSessionId = `${data.callType}${data.to}`
    const callSession = await callSessionRepo.get(callSessionId)
    if (!callSession) return

    const userSession = await userSessionRepo.get(data.userId)
    const pipeline = await kurentoMediaRepo.getMediaById(callSession.pipelineId)
    const userWebrtcEndpoint = await kurentoMediaRepo.getMediaById(
      userSession.webRtcEndpointId
    )
    const userHubportEndpoint = await kurentoMediaRepo.getMediaById(
      userSession.hubportEndpointId
    )

    await userWebrtcEndpoint.release()
    await userHubportEndpoint.release()

    await callSessionRepo.removeUserId(callSessionId, data.userId)

    const isCallEnd =
      data.callType === CALL_TYPE_PRIVATE || callSession.userIds.length <= 2
    if (isCallEnd) {
      await pipeline.release()
      await callSessionRepo.remove(callSessionId)

      const io = socketIoWrapper.getClient()
      const room =
        data.callType === CALL_TYPE_PRIVATE
          ? `${PRIVATE_USER_ROOM_PREFIX}${data.to}`
          : `${GROUP_USER_ROOM_PREFIX}${data.to}`
      io.to(room).emit('stop-call', { data })
    }
  })
}
