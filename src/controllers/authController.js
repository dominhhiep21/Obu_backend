import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import env from '~/config/environment'
import jwt from 'jsonwebtoken'

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
    result.data.accToken = result.accToken

    if (!result.success) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: result.message
      })
    }
    res.cookie('RefreshToken', result.rfsToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })

    res.status(StatusCodes.OK).json({
      user: result.data
    })
  } catch (error) {
    next(error)
  }
}

const requestRefreshToken = (req, res) => {
  const refreshToken = req.cookies.RefreshToken
  if (!refreshToken) return res.status(StatusCodes.UNAUTHORIZED).json('You are not authenticated')
  jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token is not valid' })
    }
    const newAccessToken = authService.generateAccessToken(user)
    const newRefreshToken = authService.generateRefreshToken(user)
    res.cookie('RefreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    res.status(StatusCodes.OK).json({ accToken: newAccessToken })
  })
}

const logOutUser = async (req, res) => {
  res.clearCookie('RefreshToken')
  res.status(StatusCodes.OK).json('Log out successfully')
}

export const authController = {
  createNew,
  loginUser,
  requestRefreshToken,
  logOutUser
}