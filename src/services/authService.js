/* eslint-disable no-useless-catch */
import ApiError from '~/utils/apiErrors'
import { StatusCodes } from 'http-status-codes'
import { authModel } from '~/models/authModel'
import { valid } from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const createNew = async (reqBody) => {
  try {
    const newAuth = {
      ...reqBody
    }
    const createdAuth = await authModel.createNew(newAuth)
    if (createdAuth == null) return { CreateResult: 'This user already exists' }
    const searchedAuth = await authModel.findOneById(createdAuth.insertedId)
    const { password, ...safeAuth } = searchedAuth
    return safeAuth
  } catch (error) {
    throw error
  }
}

const loginUser = async (reqBody) => {
  try {
    const loginAuth = {
      ...reqBody
    }

    const loginedAuth = await authModel.findOneByName(loginAuth.username)
    //console.log(loginedAuth)
    if (!loginedAuth) {
      return { success: false, message: 'This user does not exist' }
    }

    const validPassword = await bcrypt.compare(
      loginAuth.password,
      loginedAuth.password
    )

    if (!validPassword) {
      return { success: false, message: 'Your password is wrong' }
    }

    const accessToken = authService.generateAccessToken(loginedAuth)
    const refreshToken = authService.generateRefreshToken(loginedAuth)
    const { password, ...safeUser } = loginedAuth
    return { success: true, data: safeUser, accToken: accessToken, rfsToken: refreshToken }
  } catch (error) {
    throw error
  }
}

const generateAccessToken = (user) => {
  return jwt.sign({
    id: user._id,
    admin: user.admin
  },
  env.JWT_ACCESS_KEY,
  { expiresIn: '30s' }
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign({
    id: user._id,
    admin: user.admin
  },
  env.JWT_REFRESH_KEY,
  { expiresIn: '365d' }
  )
}

export const authService = {
  createNew,
  loginUser,
  generateAccessToken,
  generateRefreshToken
}