/* eslint-disable no-useless-catch */
import ApiError from '~/utils/apiErrors'
import { StatusCodes } from 'http-status-codes'
import { authModel } from '~/models/authModel'
import { valid } from 'joi'
import bcrypt from 'bcrypt'

const createNew = async (reqBody) => {
  try {
    const newAuth = {
      ...reqBody
    }

    const createdAuth = await authModel.createNew(newAuth)
    if (createdAuth == null) return { CreateResult: 'This user already exists' }
    const searchedAuth = await authModel.findOneById(createdAuth.insertedId)
    return searchedAuth
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

    return { success: true, data: loginedAuth }
  } catch (error) {
    throw error
  }
}

export const authService = {
  createNew,
  loginUser
}