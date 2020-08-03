const { socketIoWrapper } = require('../client-wrappers')
const io =socketIoWrapper.getClient()

io.on('connection', (socket) => {
  console.log('kame')
})
