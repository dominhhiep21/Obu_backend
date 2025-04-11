import express from 'express'
import cors from 'cors'
import { env } from '~/config/environment'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { API_V1 } from '~/routes/v1'
import { mqttClient } from '~/mqtt/mqttClient'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { corsOptions } from './config/cors'

const START_SERVER = () => {

  const app = express()

  const hostname = env.LOCAL_DEV_APP_HOST
  const port = env.LOCAL_DEV_APP_PORT

  app.use(express.json())

  app.use(cors(corsOptions))

  app.use('/v1', API_V1)

  app.use(errorHandlingMiddleware)

  mqttClient.initMQTT()

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Production : Hello DMH Dev, I am running at ${process.env.PORT}`)
    })
  } else {
    app.listen(port, hostname, () => {
      console.log(`Hello DMH Dev, I am running at ${hostname}:${port}`)
    })
  }
  exitHook((signal) => {
    // console.log(`Exitting with signal ${signal}`)
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas'))
  .then(() => START_SERVER())
  .catch(
    error => {
      console.error(error)
      process.exit(0)
    }
  )