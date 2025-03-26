import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const GPS_COLLECTION_NAME = 'gpss'
const GPS_COLLECTION_SCHEMA = Joi.object({
  device_id: Joi.string().required().min(1).max(50).trim().strict(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  //deviceId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  route_name: Joi.string().required().min(3).max(50).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await GPS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdGPS = await GET_DB().collection(GPS_COLLECTION_NAME).insertOne(validData)
    return createdGPS
  } catch (error) {
    throw new Error(error)
  }
}

const getDetail = async () => {
  try {
    const result = await GET_DB().collection(GPS_COLLECTION_NAME).find({}).project({ _destroy: 0 }).sort({ 'createdAt':-1 }).limit(10).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetailId = async (device_id) => {
  try {
    const result = await GET_DB().collection(GPS_COLLECTION_NAME).find({device_id}).project({ _destroy: 0 }).sort({ 'createdAt':-1 }).limit(10).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const gpsModel = {
  GPS_COLLECTION_NAME,
  GPS_COLLECTION_SCHEMA,
  createNew,
  getDetail,
  getDetailId
}
