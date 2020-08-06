const { callSessionRepo, kurentoMediaRepo } = require('../repos')
const {CALL_TYPE_PRIVATE} = require('../constants')

module.exports = function enableEvent(socket) {
  socket.on('stop-call', async ({ data }) => {
    const callSessionId = `${data.callType}${data.to}`
    const callSession = await callSessionRepo.get(callSessionId)
    const pipeline = await kurentoMediaRepo.getMediaById(callSession.pipelineId)

    if(data.callType === CALL_TYPE_PRIVATE || callSession.userIds.length <= 2) {
      await pipeline.release()
      await callSessionRepo.remove(callSessionId)
      return
    }

    //TODO: implement remove user in group call (remove in session, disconnect endpoint, hubport)
  })
}
