import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { tollStationValidation } from '~/validations/tollStationValidation'
import { tollStationController } from '~/controllers/tollStationController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message : 'API get list toll station'
    })
  })
  .post(tollStationValidation.createNew, tollStationController.createNew)

Router.route('/all')
  .get(tollStationController.getDetail)

Router.route('/:id')
  .get(tollStationController.getDetailId)
  .put(tollStationValidation.update, tollStationController.update)
  .delete(tollStationValidation.deleteStation, tollStationController.deleteStation)
  
export const tollStationRoute = Router