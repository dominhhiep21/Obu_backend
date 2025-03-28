import { StatusCodes } from 'http-status-codes'
import { tollHistoryService } from '~/services/tollHistoryService'

// const createNew = async (req, res, next) => {
//   try {
//     const createdTollHistory = await tollHistoryService.createNew(req.body)

//     res.status(StatusCodes.CREATED).json({
//       createdTollHistory
//     })

//   } catch (error) {
//     next(error)
//   }
// }

// const getDetail = async (req, res, next) => {
//   try {

//     const tollStation = await tollStationService.getDetail()

//     res.status(StatusCodes.OK).json({ tollStation })
//   } catch (error) {
//     next(error)
//   }
// }

const getDetailId = async (req, res, next) => {
  try {
    const tollStationId = req.params.device_id
    const tollHistory = await tollHistoryService.getDetailId(tollStationId)

    res.status(StatusCodes.OK).json({ tollHistory })
  } catch (error) {
    next(error)
  }
}

// const update = async (req, res, next) => {
//   try {
//     const tollStationId = req.params.id
//     const tollStation = await tollStationService.update(tollStationId, req.body)

//     res.status(StatusCodes.OK).json({ tollStation })
//   } catch (error) {
//     next(error)
//   }
// }

const deleteHistory = async (req, res, next) => {
  try {
    const tollStationId = req.params.device_id
    const tollHistory = await tollHistoryService.deleteHistory(tollStationId)

    res.status(StatusCodes.OK).json({ tollHistory })
  } catch (error) {
    next(error)
  }
}

export const tollHistoryController = {
  //createNew,
  //getDetail,
  getDetailId,
  //update,
  deleteHistory
}