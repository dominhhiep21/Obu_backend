import { StatusCodes } from 'http-status-codes'
import { deviceService } from '~/services/deviceService'

const createNew = async (req, res, next) => {
  try {
    const createdDevice = await deviceService.createNew(req.body)

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

const getDetailId = async (req, res, next) => {
  try {
    const deviceId = req.params.device_id
    const startTime = req.query.startTime
    const endTime = req.query.endTime

    let query = { device_id: deviceId }

    if (startTime && endTime) {

      query.startTime = new Date(`${startTime.trim()}T00:00:00Z`).getTime()
      query.endTime = new Date(`${endTime.trim()}T23:59:59.999Z`).getTime()

      console.log(startTime)
      console.log(endTime)
      console.log(query.startTime)
      console.log(query.endTime)

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
  deleteDevice
}