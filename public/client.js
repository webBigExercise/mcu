const io = require('socket.io-client')
const kurentoUtils = require('kurento-utils')
require('webrtc-adapter')

//const wsUrl = `https://localhost:3000`
const wsUrl = location.host
const socket = io(wsUrl)
let webRtcPeer
let userId //TODO: in the future should use username or real user-id instead of socket.id

socket.on('connect', () => {
  console.log('connected')
  userId = socket.id
  document.querySelector('#username').innerText = `Your id is ${userId}`
})

document.querySelector('#stop-btn').onclick = function () {
  socket.emit('stop-call', {
    data: {
      callerId: userId,
      calleeId: document.querySelector('#to').value,
    },
  })
}

document.querySelector('#call-btn').onclick = function makeCall() {
  const callType = document.querySelector('#call-type').value
  const webRtcPeerOptions = {
    localVideo: document.querySelector('#videoInput'),
    remoteVideo: document.querySelector('#videoOutput'),

    //browser collect ice candidate (network connection)
    onicecandidate: (candidate) =>
      socket.emit('client-send-ice-candidate', {
        data: { candidate, userId },
      }),
  }

  webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
    webRtcPeerOptions,
    function (err) {
      if (err) return console.error(err)
      this.generateOffer((err, sdp) => {
        if (err) return console.error(err)

        socket.emit('client-make-call', {
          data: {
            callerOfferSdp: sdp,
            callType,
            to: document.querySelector('#to').value,
            from: userId,
          },
        })
      })
    }
  )
}

socket.on('client-have-incoming-call', async ({ data }) => {
  const webRtcPeerOptions = {
    localVideo: document.querySelector('#videoInput'),
    remoteVideo: document.querySelector('#videoOutput'),

    //browser collect ice candidate (network connection)
    onicecandidate: (candidate) =>
      socket.emit('client-send-ice-candidate', {
        data: { candidate, userId },
      }),
  }

  webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
    webRtcPeerOptions,
    function (err) {
      if (err) return console.error(err)
      this.generateOffer((err, sdp) => {
        if (err) return console.error(err)
        socket.emit('client-accept-call', {
          data: {
            callerUserId: data.from,
            acceptUserId: userId,
            acceptUserSdp: sdp,
            to: data.to, // room or private user
            callerOfferSdp: data.callerOfferSdp,
            callType: data.callType,
          },
        })
      })
    }
  )
})

socket.on('client-accept-call', ({ data }) => {
  socket.emit('server-start-call-session', { data })
})

socket.on('server-send-kurento-candidate', ({ data }) => {
  webRtcPeer.addIceCandidate(data.candidate)
})

socket.on('start-communication', ({ data }) => {
  webRtcPeer.processAnswer(data.sdp)
})
