/* eslint-disable no-useless-catch */
import ApiError from '~/utils/apiErrors'
import { StatusCodes } from 'http-status-codes'
import { deviceModel } from '~/models/deviceModel'

const createNew = async (reqBody) => {
  try {
    const newDevice = {
      ...reqBody
    }

    const createdDevice = await deviceModel.createNew(newDevice)
    if (createdDevice == null) return { CreateResult: 'This device already exists' }
    const searchedDevice = await deviceModel.findOneById(createdDevice.insertedId)
    return searchedDevice
  } catch (error) {
    throw error
  }
}

const getDetail = async () => {
  try {
    const device = await deviceModel.getDetail()

    if (!device) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Device detail not found')
    }

    return device
  } catch (error) {
    throw error
  }
}

const getDetailId = async (query) => {
  try {
    const device = await deviceModel.findOneByDeviceId(query)

    if (!device) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Device detail not found')
    }

    return device
  } catch (error) {
    throw error
  }
}


const update = async (deviceId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedDevice = await deviceModel.update(deviceId, updateData)

    return updatedDevice
  } catch (error) {
    throw error
  }
}

const deleteDevice = async (deviceId) => {
  try {
    await deviceModel.deleteOneById(deviceId)

    return { deleteResult: 'This device was deleted successfully' }
  } catch (error) {
    throw error
  }
}

const getDetailViaUserId = async (userId) => {
  try {
    const device = await deviceModel.findAllByUserId(userId)
    if (device != null) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Device detail not found')
    }
    return device
  } catch (error) {
    throw error
  }
}

export const deviceService = {
  createNew,
  getDetail,
  getDetailId,
  update,
  deleteDevice,
  getDetailViaUserId
}