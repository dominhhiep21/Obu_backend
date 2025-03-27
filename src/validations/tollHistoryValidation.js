import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/apiErrors'

// const createNew = async (req, res, next) => {

//   const validateFormat = Joi.object({
//     station_name: Joi.string().required().trim().strict(),
//     fee: Joi.number().min(0).required()
//   })

//   try {
//     await validateFormat.validateAsync(req.body, { abortEarly: false })

//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
//   }
// }

// const update = async (req, res, next) => {

//   const validateFormat = Joi.object({
//     station_name: Joi.string().trim().strict(),
//     fee: Joi.number().min(0)
//   })

//   try {
//     await validateFormat.validateAsync(req.body, {
//       abortEarly: false,
//       allowUnknown: true })

//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
//   }
// }

const deleteHistory = async (req, res, next) => {

  const validateFormat = Joi.object({
    device_id: Joi.string().required().trim().strict()
  })

  try {
    await validateFormat.validateAsync(req.params)

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const tollHistoryValidation = {
  //createNew,
  //update,
  deleteHistory
}