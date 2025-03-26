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
  .get(deviceController.getDetail)

Router.route('/:device_id')
  .get(deviceController.getDetailId)
  .put(deviceValidation.update, deviceController.update)
  .delete(deviceValidation.deleteDevice, deviceController.deleteDevice)

export const deviceRoute = Router