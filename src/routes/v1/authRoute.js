import express from 'express'
import { authController } from '~/controllers/authController'
import { authHandlingMiddleware } from '~/middlewares/authHandlingMiddleware'
import { authValidation } from '~/validations/authValidation'

const Router = express.Router()

Router.route('/register')
  .post(authValidation.createNew, authController.createNew)

Router.route('/login')
  .post(authValidation.loginUser, authController.loginUser)

Router.route('/refresh')
  .post(authController.requestRefreshToken)

Router.route('/logout')
  .post(authHandlingMiddleware.authMiddleware, authController.logOutUser)

export const authRoute = Router