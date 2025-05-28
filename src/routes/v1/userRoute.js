import express from 'express'
import { userController } from '~/controllers/userController'
import { authHandlingMiddleware } from '~/middlewares/authHandlingMiddleware'
import { authValidation } from '~/validations/authValidation'

const Router = express.Router()

Router.route('/all')
  .get(authHandlingMiddleware.authMiddleware, userController.getAll)

Router.route('/:id')
  .get(authHandlingMiddleware.verifyAuthAndAdminRole, userController.getDetailId)
  .put(authHandlingMiddleware.verifyAuthAndAdminRole, authValidation.update, userController.update)//Sửa đổi thông tin tài khoản
  .delete(authHandlingMiddleware.verifyAuthAndAdminRole, authValidation.deleteUser, userController.deleteUser)//Xóa tài khoản

export const userRoute = Router