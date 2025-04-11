import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { deviceValidation } from '~/validations/deviceValidation'
import { deviceController } from '~/controllers/deviceController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message : 'API get list device station'
    })
  })
  .post(deviceValidation.createNew, deviceController.createNew)

Router.route('/all')
  .get(deviceController.getDetail)//Lấy toàn bộ thiết bị

// http://localhost:8017/v1/device/gps_device?startTime=2025-04-03&endTime=2025-04-05
Router.route('/:device_id')
  .get(deviceController.getDetailId)//Lấy thông tin thiết bị theo id
  .put(deviceValidation.update, deviceController.update)//Sửa đổi thông tin thiết bị
  .delete(deviceValidation.deleteDevice, deviceController.deleteDevice)//Xóa thiết bị

export const deviceRoute = Router