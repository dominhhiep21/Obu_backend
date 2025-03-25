/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import ApiError from '~/utils/apiErrors'
import { StatusCodes } from 'http-status-codes'
import { gpsModel } from '~/models/gpsModel'

const getDetail = async () => {
  try {
    const device = await gpsModel.getDetail()

    if (!device) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Device detail not found')
    }

    return device
  } catch (error) {
    throw error
  }
}

const getDetailId = async (device_id) => {
  try {
    const device = await gpsModel.getDetailId(device_id)

    if (!device) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Device detail with this id not found')
    }

    return device
  } catch (error) {
    throw error
  }
}

export const gpsService = {
  getDetail,
  getDetailId
}