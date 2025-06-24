import { StatusCodes } from 'http-status-codes'
import { deviceService } from '~/services/deviceService'
import { ObjectId } from 'mongodb'

const createNew = async (req, res, next) => {
  try {
    const dataWithOwner = {
      ...req.body,
      ownerId: req.user.id
    }
    //console.log(req.user)
    const createdDevice = await deviceService.createNew(dataWithOwner)

    res.status(StatusCodes.CREATED).json({
      createdDevice
    })

  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {

    const device = await deviceService.getDetail()

    res.status(StatusCodes.OK).json({ device })
  } catch (error) {
    next(error)
  }
}

const getDeviceViaUserId = async(req, res, next) => {
  try {
    const userId = req.params.userId

    const device = await deviceService.getDetailViaUserId(userId)

    res.status(StatusCodes.OK).json({ device })

  } catch (error) {
    next(error)
  }
}

const getDetailId = async (req, res, next) => {
  try {
    const deviceId = req.params.device_id
    const startTime = req.query.startTime
    const endTime = req.query.endTime

    let query = { device_id: deviceId }

    if (startTime && endTime) {

      query.startTime = new Date(`${startTime.trim()}T00:00:00Z`).getTime()
      query.endTime = new Date(`${endTime.trim()}T23:59:59Z`).getTime()

      // console.log(startTime)
      // console.log(endTime)
      // console.log(query.startTime)
      // console.log(query.endTime)

    }

    const device = await deviceService.getDetailId(query)

    res.status(StatusCodes.OK).json({ device })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const deviceId = req.params.device_id
    const device = await deviceService.update(deviceId, req.body)

    res.status(StatusCodes.OK).json({ device })
  } catch (error) {
    next(error)
  }
}

const deleteDevice = async (req, res, next) => {
  try {
    const deviceId = req.params.device_id
    const device = await deviceService.deleteDevice(deviceId)

    res.status(StatusCodes.OK).json({ device })
  } catch (error) {
    next(error)
  }
}

export const deviceController = {
  createNew,
  getDetail,
  getDetailId,
  update,
  deleteDevice,
  getDeviceViaUserId
}