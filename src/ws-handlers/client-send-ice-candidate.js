const kurento = require('kurento-client')
const { kurentoMediaRepo, candidateQueueRepo, userSessionRepo } = require('../repos')

module.exports = function enableEvent(socket) {
  socket.on('client-send-ice-candidate', async ({ data }) => {
    const rawCanidate = data.candidate
    const userId = data.userId
    const candidate = kurento.getComplexType('IceCandidate')(rawCanidate)
    
    const userSession = await userSessionRepo.get(userId)
    const webRtcEndpoint = await kurentoMediaRepo.getMediaById(userSession.webRtcEndpointId)

    if (webRtcEndpoint) await webRtcEndpoint.addIceCandidate(candidate)
    else await candidateQueueRepo.push(userId, rawCanidate)
  })
}
