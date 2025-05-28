import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
//import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import bcrypt from 'bcrypt'

const AUTH_COLLECTION_NAME = 'auth'
const AUTH_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(1).max(255).trim().strict(),
  password: Joi.string().required().min(8).max(255).trim().strict(),
  email: Joi.string().required().min(8).max(255).trim().strict(),
  admin: Joi.bool().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATED_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await AUTH_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(AUTH_COLLECTION_NAME).findOne(
      { username: data.username }
    )
    if (!result) {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(validData.password, salt)
      validData.password = hashed
      const createdAuth = await GET_DB().collection(AUTH_COLLECTION_NAME).insertOne(validData)
      return createdAuth
    }
    return null
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(AUTH_COLLECTION_NAME).findOne(
      { _id: new ObjectId(id) },
      { projection: { _destroy: 0 } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByName = async (name) => {
  try {
    const result = await GET_DB().collection(AUTH_COLLECTION_NAME).findOne(
      { username: name },
      { projection: { destroy: 0 } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// const getDetail = async () => {
//   try {
//     const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).find({}).project({ _destroy: 0 }).sort({ 'createdAt':-1 }).toArray()
//     return result
//   } catch (error) {
//     throw new Error(error)
//   }
// }

// const update = async (tollStationId, reqBody) => {
//   try {
//     Object.keys(reqBody).forEach(fieldName => {
//       if (INVALID_UPDATED_FIELDS.includes(fieldName)) {
//         delete reqBody[fieldName]
//       }
//     })

//     const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).findOneAndUpdate(
//       { _id: new ObjectId(tollStationId) },
//       { $set: reqBody },
//       { ReturnDocument: 'after' }
//     )
//     return result
//   } catch (error) {
//     throw new Error(error)
//   }
// }

// const deleteOneById = async (tollStationId) => {
//   try {
//     const result = await GET_DB().collection(TOLL_STATION_COLLECTION_NAME).deleteOne(
//       { _id : new ObjectId(tollStationId) }
//     )
//     return result
//   } catch (error) {
//     throw new Error(error)
//   }
// }

export const authModel = {
  AUTH_COLLECTION_NAME,
  AUTH_COLLECTION_SCHEMA,
  INVALID_UPDATED_FIELDS,
  createNew,
  findOneById,
  findOneByName
  // getDetail,
  // update,
  // deleteOneById
}