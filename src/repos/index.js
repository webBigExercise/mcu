const candidateQueueRepo = require('./candidate-queue')
const kurentoMediaRepo = require('./kurento-media')
const callSessionRepo = require('./call-session')
const userSessionRepo = require('./user-session')
const rtpPortRepo = require('./rtp-port')

module.exports = {
  candidateQueueRepo,
  kurentoMediaRepo,
  callSessionRepo,
  userSessionRepo,
  rtpPortRepo,
}
