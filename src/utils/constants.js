import { Server } from 'socket.io'

export const WHITELIST_DOMAINS = [
  //'http://localhost:8017'
]

let _io = null

const initSocketIO = (httpServer) => {
  _io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
  return _io
}

const getIO = () => _io

export { initSocketIO, getIO }

