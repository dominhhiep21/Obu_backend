import { getIO } from '~/utils/constants'

class SocketServices {

  connection(socket) {
    const _io = getIO()
    _io.emit('user connected', `User ${socket.id} đã kết nối.`)
    console.log(`User connection id is ${socket.id}`)

    socket.on('location message', msg => {
      console.log(`msg is:::${msg}`)
      // const _io = getIO()
      socket.broadcast.emit('location message', msg)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnection id is ${socket.id}`)
    })
  }
}
module.exports = new SocketServices()