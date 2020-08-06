const kurento = require('kurento-client')
const { socketIoWrapper } = require('../client-wrappers')
const { PRIVATE_USER_ROOM_PREFIX } = require('../constants')
const {
  kurentoMediaRepo,
  candidateQueueRepo,
  callSessionRepo,
  userSessionRepo,
} = require('../repos')

module.exports = function enableEvent(socket) {
  socket.on('server-start-call-session', async ({ data }) => {
    //TODO: this code only works for 1-1, need support for case (new accept user(3rd persion) when session is existed already and this persion is just add to session, not create)
    const sessionId = `${data.callType}${data.to}`
    const pipeline = await kurentoMediaRepo.create('MediaPipeline')

    //endpoint
    const callerWebRtcEndpoint = await pipeline.create('WebRtcEndpoint')
    const acceptUserWebRtcEndpoint = await pipeline.create('WebRtcEndpoint')
    const rtpEndpoint = await pipeline.create('RtpEndpoint')

    //hub
    //mixing video
    const composite = await pipeline.create('Composite')
    const callerHubport = await composite.createHubPort()
    const acceptUserHubport = await composite.createHubPort()
    const rtpHubport = await composite.createHubPort()
    
    await addQueuedCandidateToEndpoint(callerWebRtcEndpoint, data.callerUserId)
    await addQueuedCandidateToEndpoint(
      acceptUserWebRtcEndpoint,
      data.acceptUserId
    )
    sendIceCandidateToClient(callerWebRtcEndpoint, data.callerUserId)
    sendIceCandidateToClient(acceptUserWebRtcEndpoint, data.acceptUserId)

    //connection
    await callerWebRtcEndpoint.connect(callerHubport)
    await callerHubport.connect(callerWebRtcEndpoint)

    await acceptUserWebRtcEndpoint.connect(acceptUserHubport)
    await acceptUserHubport.connect(acceptUserWebRtcEndpoint)

    await rtpHubport.connect(rtpEndpoint)

    //process sdp offer
    const callerAnswerSdp = await callerWebRtcEndpoint.processOffer(
      data.callerOfferSdp
    )
    const acceptUserAnswerSdp = await acceptUserWebRtcEndpoint.processOffer(
      data.acceptUserSdp
    )

    await callerWebRtcEndpoint.gatherCandidates()
    await acceptUserWebRtcEndpoint.gatherCandidates()

    sendSdpAnswerToClient(data.callerUserId, callerAnswerSdp)
    sendSdpAnswerToClient(data.acceptUserId, acceptUserAnswerSdp)

    //create session
    await callSessionRepo.create({
      id: sessionId,
      pipelineId: pipeline.id,
      userIds: [data.callerUserId, data.acceptUserId],
    })
    await userSessionRepo.set(data.callerUserId, {
      webRtcEndpointId: callerWebRtcEndpoint.id,
      hubportEndpointId: callerHubport.id,
    })
    await userSessionRepo.set(data.acceptUserId, {
      webRtcEndpointId: acceptUserWebRtcEndpoint.id,
      hubportEndpointId: acceptUserHubport.id,
    })
  })
}

async function addQueuedCandidateToEndpoint(endpoint, userSessionId) {
  const candidates = await candidateQueueRepo.listAll(userSessionId)

  for (const rawCandidate of candidates) {
    const deserialized = JSON.parse(rawCandidate)
    const candidate = kurento.getComplexType('IceCandidate')(deserialized)
    endpoint.addIceCandidate(candidate)
  }

  await candidateQueueRepo.remove(userSessionId)
}

function sendIceCandidateToClient(endpoint, userId) {
  endpoint.on('OnIceCandidate', (evt) => {
    const candidate = kurento.getComplexType('IceCandidate')(evt.candidate)
    const userPrivateRoom = `${PRIVATE_USER_ROOM_PREFIX}${userId}`
    const io = socketIoWrapper.getClient()

    io.to(userPrivateRoom).emit('server-send-kurento-candidate', {
      data: { candidate },
    })
  })
}

function sendSdpAnswerToClient(userId, sdp) {
  const io = socketIoWrapper.getClient()
  const userPrivateRoom = `${PRIVATE_USER_ROOM_PREFIX}${userId}`

  io.to(userPrivateRoom).emit('start-communication', {
    data: { sdp },
  })
}
