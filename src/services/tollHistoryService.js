/* eslint-disable no-useless-catch */
import ApiError from '~/utils/apiErrors'
import { StatusCodes } from 'http-status-codes'
import { tollHistoryModel } from '~/models/tollHistoryModel'

// const createNew = async (reqBody) => {
//   try {
//     const newTollStation = {
//       ...reqBody
//     }

//     const createdTollStation = await tollStationModel.createNew(newTollStation)

//     const searchedTollStation = await tollStationModel.findOneById(createdTollStation.insertedId)

//     return searchedTollStation
//   } catch (error) {
//     throw error
//   }
// }

// const getDetail = async () => {
//   try {
//     const tollStation = await tollStationModel.getDetail()

//     if (!tollStation) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Toll station detail not found')
//     }

//     return tollStation
//   } catch (error) {
//     throw error
//   }
// }

const getDetailId = async (tollStationId) => {
  try {
    const tollHistory = await tollHistoryModel.findOneById(tollStationId)

    if (!tollHistory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Toll history detail not found')
    }

    return tollHistory
  } catch (error) {
    throw error
  }
}

// const update = async (tollStationId, reqBody) => {
//   try {
//     const updateData = {
//       ...reqBody,
//       updatedAt: Date.now()
//     }
//     const updatedTollStation = await tollStationModel.update(tollStationId, updateData)

//     return updatedTollStation
//   } catch (error) {
//     throw error
//   }
// }

const deleteHistory = async (tollStationId) => {
  try {
    await tollHistoryModel.deleteOneById(tollStationId)

    return { deleteResult : 'This toll history was deleted successfully' }
  } catch (error) {
    throw error
  }
}

export const tollHistoryService = {
  //createNew,
  //getDetail,
  getDetailId,
  //update,
  deleteHistory
}