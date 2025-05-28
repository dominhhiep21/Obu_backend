import express from 'express'
import cors from 'cors'
import { env } from '~/config/environment'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { API_V1 } from '~/routes/v1'
import { mqttClient } from '~/mqtt/mqttClient'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { corsOptions } from './config/cors'
import { initSocketIO } from './utils/constants'
import cookieParser from 'cookie-parser'
import exampleSocket from './sockets/exampleSocket'
import http from 'http'

const START_SERVER = () => {
  const app = express()
  const hostname = env.LOCAL_DEV_APP_HOST
  const port = env.LOCAL_DEV_APP_PORT

  const httpServer = http.createServer(app)

  // Khởi tạo Socket.IO
  const _io = initSocketIO(httpServer)
  _io.on('connect', exampleSocket.connection)

  // Middleware & API
  app.use(express.json())
  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use('/v1', API_V1)
  app.use(errorHandlingMiddleware)

  // MQTT
  mqttClient.initMQTT()

  // Start Server
  const listenPort = env.BUILD_MODE === 'production' ? process.env.PORT : port
  httpServer.listen(listenPort, hostname, () => {
    console.log(`Server running at ${hostname}:${listenPort}`)
  })

  // Hook để đóng DB
  exitHook((signal) => {
    CLOSE_DB()
  })
}

// Kết nối DB rồi khởi động server
CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas'))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error)
    process.exit(0)
  })
