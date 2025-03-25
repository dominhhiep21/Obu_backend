import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { gpsController } from '~/controllers/gpsController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message : 'API get list location'
    })
  })

Router.route('/all')
  .get(gpsController.getDetail)
  .put()

Router.route('/:device_id')
  .get(gpsController.getDetailId)

export const locationRoute = Router