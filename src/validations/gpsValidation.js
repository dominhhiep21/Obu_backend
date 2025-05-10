import Joi from 'joi'

const createNew = async (data) => {
  const validateFormat = Joi.object({
    device_id: Joi.string().required().min(1).max(50).trim().strict(),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    alt: Joi.number().min(-180).max(180).required(),
    route_name: Joi.string().required().min(1).max(50).trim().strict()
  })

  try {
    await validateFormat.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw new Error(`Validation error: ${error.details.map(err => err.message).join(',')}`)
  }
}

export const gpsValidation = {
  createNew
}

