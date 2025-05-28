import { GET_DB } from '~/config/mongodb'
import { authModel } from './authModel'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

const getAll = async () => {
  try {
    const result = await GET_DB().collection(authModel.AUTH_COLLECTION_NAME).find({}).sort({ 'createdAt': -1 }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (userId, reqBody) => {
  try {
    Object.keys(reqBody).forEach(fieldName => {
      if (authModel.INVALID_UPDATED_FIELDS.includes(fieldName)) {
        delete reqBody[fieldName]
      }
    })
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(reqBody.password, salt)
    reqBody.password = hashed
    const result = await GET_DB().collection(authModel.AUTH_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: reqBody },
      { projection: { _destroy: 0 } },
      { ReturnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(authModel.AUTH_COLLECTION_NAME).findOne(
      { _id: new ObjectId(id) },
      { projection: { _destroy: 0 } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(authModel.AUTH_COLLECTION_NAME).deleteOne(
      { _id: new ObjectId(userId) }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  getAll,
  update,
  deleteOneById,
  findOneById
}