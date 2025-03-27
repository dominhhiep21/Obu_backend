import Joi from 'joi'
//import { ObjectId, ReturnDocument } from 'mongodb'
import { haversineDistance } from '~/utils/haversineDistance'
import { GET_DB } from '~/config/mongodb'
import { tollStationModel } from './tollStationModel'
const TOLL_HISTORY_COLLECTION_NAME = 'toll_history'

const TOLL_HISTORY_COLLECTION_SCHEMA = Joi.object({
  device_id: Joi.string().required().trim().strict(),
  total_fee: Joi.number().min(0).default(0),
  toll_stations: Joi.array().items(
    Joi.object({
      station_name: Joi.string().required().trim().strict(),
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
      fee: Joi.number().min(0).required()
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  //updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

//const INVALID_UPDATED_FIELDS = ['_id', 'createdAt']

// const validateBeforeCreate = async (data) => {
//   return await TOLL_STATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
// }

// const createNew = async (data) => {
//   try {
//     //const validData = await validateBeforeCreate(data)
//     const createdTollStation = await GET_DB().collection(TOLL_HISTORY_COLLECTION_NAME).insertOne(data)
//     return createdTollStation
//   } catch (error) {
//     throw new Error(error)
//   }
// }

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(TOLL_HISTORY_COLLECTION_NAME).findOne(
      { device_id: id },
      { projection: { _id: 0, _destroy: 0 } }
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
const updateTollFee = async (device_id, lat, lng) => {
  try {
    const db = GET_DB()

    // Lấy danh sách tất cả các trạm thu phí
    const tollStations = await db.collection(tollStationModel.TOLL_STATION_COLLECTION_NAME).find().toArray()

    let nearestStation = null
    let minDistance = Infinity

    // Tìm trạm thu phí gần nhất (cách dưới 100m)
    tollStations.forEach(station => {
      const distance = haversineDistance(lat, lng, station.lat, station.lng)

      if (distance < 300 && distance < minDistance) {
        nearestStation = station
        minDistance = distance
      }
    })

    if (!nearestStation) return null

    let tollHistory = await db.collection(TOLL_HISTORY_COLLECTION_NAME).findOne({ device_id })

    if (!tollHistory) {
      const newHistory = {
        device_id,
        total_fee: nearestStation.fee,
        toll_stations: [{
          station_name: nearestStation.station_name,
          lat: nearestStation.lat,
          lng: nearestStation.lng,
          fee: nearestStation.fee
        }],
        createdAt: Date.now(),
        _destroy: false
      }

      await db.collection(TOLL_HISTORY_COLLECTION_NAME).insertOne(newHistory)
      return newHistory
    }

    // Kiểm tra nếu đã qua trạm này rồi
    const alreadyPassed = tollHistory.toll_stations.some(station => station.station_name === nearestStation.station_name)
    if (alreadyPassed) return null

    // Cập nhật total_fee và danh sách toll_stations
    const result = await db.collection(TOLL_HISTORY_COLLECTION_NAME).findOneAndUpdate(
      { device_id },
      {
        $push: {
          toll_stations: {
            station_name: nearestStation.station_name,
            lat: nearestStation.lat,
            lng: nearestStation.lng,
            fee: nearestStation.fee
          }
        },
        $inc: { total_fee: nearestStation.fee }
      },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (tollStationId) => {
  try {
    const result = await GET_DB().collection(TOLL_HISTORY_COLLECTION_NAME).deleteMany(
      { device_id: tollStationId }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const tollHistoryModel = {
  TOLL_HISTORY_COLLECTION_NAME,
  TOLL_HISTORY_COLLECTION_SCHEMA,
  //createNew,
  findOneById,
  //getDetail,
  //update,
  updateTollFee,
  deleteOneById
}