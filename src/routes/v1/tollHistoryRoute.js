import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { tollHistoryController } from '~/controllers/tollHistoryController'
import { authHandlingMiddleware } from '~/middlewares/authHandlingMiddleware'
import { tollHistoryValidation } from '~/validations/tollHistoryValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message : 'API get list toll history'
    })
  })
  //.post(tollHistoryValidation.createNew, tollHistoryController.createNew)

// Router.route('/all')
//   .get(tollHistoryController.getDetail)

Router.route('/:device_id')
  .get(authHandlingMiddleware.verifyAuthAndAdminRole, tollHistoryController.getDetailId)//Lấy lịch sử thu phí theo device_id nếu nhập mỗi device_id thì lấy toàn bộ data, 
  // nếu thêm startTime và endTime ở req.query thì truy vấn theo ngày
  .put(authHandlingMiddleware.verifyAuthAndAdminRole, tollHistoryController.update)//Reset phí và lịch sử thu phí thành 0
  .delete(authHandlingMiddleware.verifyAuthAndAdminRole, tollHistoryValidation.deleteHistory, tollHistoryController.deleteHistory)//Xóa lịch sử giao dịch

export const tollHistoryRoute = Router