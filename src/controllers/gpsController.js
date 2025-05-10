import { StatusCodes } from 'http-status-codes'
import { gpsService } from '~/services/gpsService'

const getDetail = async (req, res, next) => {
  try {
    const device = await gpsService.getDetail()

    res.status(StatusCodes.OK).json({ device })
  } catch (error) {
    next(error)
  }
}

// const getDetailId = async (req, res, next) => {
//   try {
//     const deviceId = req.params.device_id

//     const device = await gpsService.getDetailId(deviceId)

//     res.status(StatusCodes.OK).json({ device })
//   } catch (error) {
//     next(error)
//   }
// }

export const gpsController = {
  getDetail
  //getDetailId
}