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
  .get(tollStationController.getDetail)//Lấy toàn bộ thông tin trạm thu phí

Router.route('/:id')
  .get(tollStationController.getDetailId)//Lấy thông tin trạm thu phí theo id
  .put(tollStationValidation.update, tollStationController.update)//Sửa thông tin trạm thu phí
  .delete(tollStationValidation.deleteStation, tollStationController.deleteStation)//Xóa trạm thu phí

export const tollStationRoute = Router