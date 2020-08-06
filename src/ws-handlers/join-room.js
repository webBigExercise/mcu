module.exports = function enableEvent(socket) {
  socket.on('join-room', async ({ data }) => {
    socket.join(data.roomName)
  })
}
