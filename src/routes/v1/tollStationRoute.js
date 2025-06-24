import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { tollStationValidation } from '~/validations/tollStationValidation'
import { tollStationController } from '~/controllers/tollStationController'
import { authHandlingMiddleware } from '~/middlewares/authHandlingMiddleware'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message : 'API get list toll station'
    })
  })
  .post(
    authHandlingMiddleware.verifyAuthAndAdminRole,
    tollStationValidation.createNew,
    tollStationController.createNew
  )

Router.route('/all')
  .get(authHandlingMiddleware.authMiddleware, tollStationController.getDetail)

Router.route('/:id')
  .get(authHandlingMiddleware.authMiddleware, tollStationController.getDetailId)
  .put(authHandlingMiddleware.verifyAuthAndAdminRole, tollStationValidation.update, tollStationController.update)
  .delete(authHandlingMiddleware.verifyAuthAndAdminRole, tollStationValidation.deleteStation, tollStationController.deleteStation)

export const tollStationRoute = Router