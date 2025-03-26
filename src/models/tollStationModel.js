import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const TOLL_STATION_COLLECTION_NAME = 'toll_stations'
const TOLL_STATION_COLLECTION_SCHEMA = Joi.object({
  station_name: Joi.string().required().trim().strict(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  fee: Joi.number().min(0).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATED_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await TOLL_STATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdTollStation = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).insertOne(validData)
    return createdTollStation
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).findOne(
      { _id: new ObjectId(id) },
      { projection: { _id:0, _destroy: 0 } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetail = async () => {
  try {
    const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).find({}).project({ _destroy: 0 }).sort({ 'createdAt':-1 }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (tollStationId, reqBody) => {
  try {
    Object.keys(reqBody).forEach(fieldName => {
      if (INVALID_UPDATED_FIELDS.includes(fieldName)) {
        delete reqBody[fieldName]
      }
    })

    const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(tollStationId) },
      { $set: reqBody },
      { ReturnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (tollStationId) => {
  try {
    const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).deleteOne(
      { _id : new ObjectId(tollStationId) }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const tollStationModel = {
  TOLL_STATION_COLLECTION_NAME,
  TOLL_STATION_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  update,
  deleteOneById
}