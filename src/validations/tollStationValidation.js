import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/apiErrors'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {

  const validateFormat = Joi.object({
    station_name: Joi.string().required().trim().strict(),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    fee: Joi.number().min(0).required()
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
    station_name: Joi.string().trim().strict(),
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
    fee: Joi.number().min(0)
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

const deleteStation = async (req, res, next) => {

  const validateFormat = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await validateFormat.validateAsync(req.params.id)

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const tollStationValidation = {
  createNew,
  update,
  deleteStation
}