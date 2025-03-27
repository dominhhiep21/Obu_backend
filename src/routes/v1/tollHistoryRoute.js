import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { tollHistoryController } from '~/controllers/tollHistoryController'
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

Router.route('/:id')
  .get(tollHistoryController.getDetailId)
  //.put(tollHistoryValidation.update, tollHistoryController.update)
  .delete(tollHistoryValidation.deleteHistory, tollHistoryController.deleteHistory)

export const tollHistoryRoute = Router