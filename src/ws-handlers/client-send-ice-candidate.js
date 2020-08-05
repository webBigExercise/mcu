const kurento = require('kurento-client')
const { kurentoMediaRepo, candidateQueueRepo } = require('../repos')
const { WEBRTC_ENDPOINT_PREFIX } = require('../constants')

module.exports = function enableEvent(socket) {
  socket.on('client-send-ice-candidate', async ({ data }) => {
    const rawCanidate = data.candidate
    const userId = data.userId
    const candidate = kurento.getComplexType('IceCandidate')(rawCanidate)

    //TODO: consider using socket.id for webRtcEndpoint if allow user to have multiple call at a time
    //FIXME: get from sessionRepo not hardcode
    const webRtcEndpointId = `${WEBRTC_ENDPOINT_PREFIX}${userId}`
    const webRtcEndpoint = await kurentoMediaRepo.getMediaById(webRtcEndpointId)

    if (webRtcEndpoint) await webRtcEndpoint.addIceCandidate(candidate)
    else await candidateQueueRepo.push(userId, rawCanidate)
  })
}
