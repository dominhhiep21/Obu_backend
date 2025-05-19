import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'

//Register
const createNew = async (req, res, next) => {
  try {
    const createdAuth = await authService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      createdAuth
    })

  } catch (error) {
    next(error)
  }
}
//Login
const loginUser = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body)

    if (!result.success) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: result.message
      })
    }

    res.status(StatusCodes.OK).json({
      user: result.data
    })
  } catch (error) {
    next(error)
  }
}


export const authController = {
  createNew,
  loginUser
}