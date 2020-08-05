module.exports = function enableEvent(socket) {
  socket.on('join-room', async ({ data }) => {
    socket.join(data.roomName)
    
    //TODO: Maybe create a response message (e.g: join-room-resp) to allow client know success
  })
}
