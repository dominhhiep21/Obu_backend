import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/apiErrors'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {

  const validateFormat = Joi.object({
    username: Joi.string().required().min(1).max(255).trim().strict(),
    password: Joi.string().required().min(8).max(255).trim().strict(),
    email: Joi.string().required().min(8).max(255).trim().strict()
  })

  try {
    await validateFormat.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const loginUser = async (req, res, next) => {

  const validateFormat = Joi.object({
    username: Joi.string().required().min(1).max(255).trim().strict(),
    password: Joi.string().required().min(8).max(255).trim().strict()
  })

  try {
    await validateFormat.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {

  const validateFormat = Joi.object({
    username: Joi.string().required().min(1).max(255).trim().strict(),
    password: Joi.string().required().min(8).max(255).trim().strict()
  })

  try {
    await validateFormat.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true })

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const deleteUser = async (req, res, next) => {

  const validateFormat = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await validateFormat.validateAsync(req.params)

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const authValidation = {
  createNew,
  loginUser,
  update,
  deleteUser
}