import express from 'express'
import { authController, registerController } from '~/controllers/authController'
import { authValidation } from '~/validations/authValidation'

const Router = express.Router()

Router.route('/register')
  .post(authValidation.createNew, authController.createNew)

Router.route('/login')
  .post(authValidation.loginUser, authController.loginUser)
export const authRoute = Router