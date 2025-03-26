import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { locationRoute } from './locationRoute'
import { tollStationRoute } from './tollStationRoute'
import { deviceRoute } from './deviceRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message : 'API v1 init successfully'
  })
})

Router.use('/location', locationRoute)

Router.use('/tollstation', tollStationRoute)

Router.use('/device', deviceRoute)

export const API_V1 = Router