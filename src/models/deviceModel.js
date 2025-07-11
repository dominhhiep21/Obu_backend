import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { gpsModel } from './gpsModel'
import { tollHistoryModel } from './tollHistoryModel'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
const DEVICE_COLLECTION_NAME = 'devices'

const DEVICE_COLLECTION_SCHEMA = Joi.object({
  device_id: Joi.string().required().trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  ownerId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATED_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await DEVICE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(DEVICE_COLLECTION_NAME).findOne(
      { device_id: data.device_id }
    )
    if (!result) {
      validData.ownerId = new ObjectId(validData.ownerId)
      const createdDevice = await GET_DB().collection(DEVICE_COLLECTION_NAME).insertOne(validData)

      const tollHistoryData = {
        device_id: validData.device_id
      }

      const validTollHistory = await tollHistoryModel.TOLL_HISTORY_COLLECTION_SCHEMA.validateAsync(tollHistoryData, { abortEarly: false })
      await GET_DB().collection(tollHistoryModel.TOLL_HISTORY_COLLECTION_NAME).insertOne(validTollHistory)
      return createdDevice
    }
    return null
  } catch (error) {
    throw new Error(error)
  }
}

const findAllByUserId = async (userId) => {
  try {
    const device = await GET_DB().collection(DEVICE_COLLECTION_NAME).find(
      { ownerId: new ObjectId(userId) },
      { projection: { _destroy: 0 } }
    )
    return device
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(DEVICE_COLLECTION_NAME).findOne(
      { _id: new ObjectId(id) },
      { projection: { _destroy: 0 } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByDeviceId = async (query) => {

  try {

    const matchStage = {
      $match: {
        device_id: query.device_id,
        _destroy: false
      }
    }

    const lookupStage = {
      $lookup: {
        from: gpsModel.GPS_COLLECTION_NAME,
        let: { deviceId: '$device_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$device_id', '$$deviceId']
              }
            }
          },
          ...(query.startTime && query.endTime
            ? [{
              $match: {
                createdAt: {
                  $gte: query.startTime,
                  $lt: query.endTime
                }
              }
            }]
            : [])
        ],
        as: 'route_info'
      }
    }

    const projectStage = {
      $project: {
        _id: 0,
        device_id: 1,
        createdAt: 1,
        updatedAt: 1,
        route_info: {
          $map: {
            input: '$route_info',
            as: 'route',
            in: {
              lat: '$$route.lat',
              lng: '$$route.lng',
              alt: '$$route.alt',
              route_name: '$$route.route_name',
              createdAt: '$$route.createdAt'
            }
          }
        }
      }
    }

    const result = await GET_DB()
      .collection(DEVICE_COLLECTION_NAME)
      .aggregate([matchStage, lookupStage, projectStage])
      .toArray()

    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}


const getDetail = async () => {
  try {
    const result = await GET_DB().collection(DEVICE_COLLECTION_NAME).find({}).project({ _destroy: 0 }).sort({ 'createdAt': -1 }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (deviceId, reqBody) => {
  try {
    Object.keys(reqBody).forEach(fieldName => {
      if (INVALID_UPDATED_FIELDS.includes(fieldName)) {
        delete reqBody[fieldName]
      }
    })

    const result = await GET_DB().collection(DEVICE_COLLECTION_NAME).findOneAndUpdate(
      { device_id: deviceId },
      { $set: reqBody },
      { returnDocument: 'after' }
    )

    await GET_DB().collection(gpsModel.GPS_COLLECTION_NAME).updateMany(
      { device_id: deviceId },
      { $set: reqBody }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (deviceId) => {
  try {
    const result = await GET_DB().collection(DEVICE_COLLECTION_NAME).deleteOne(
      { device_id: deviceId }
    )
    await GET_DB().collection(tollHistoryModel.TOLL_HISTORY_COLLECTION_NAME).deleteOne(
      { device_id: deviceId }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const deviceModel = {
  DEVICE_COLLECTION_NAME,
  DEVICE_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  update,
  deleteOneById,
  findOneByDeviceId,
  findAllByUserId
}