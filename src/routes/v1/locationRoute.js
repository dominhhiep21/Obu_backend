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

//Lấy toàn bộ dữ liệu GPS
Router.route('/all')
  .get(gpsController.getDetail)

//Lấy gps theo id *Cái này không nên dùng lắm
Router.route('/:device_id')
  .get(gpsController.getDetailId)

export const locationRoute = Router