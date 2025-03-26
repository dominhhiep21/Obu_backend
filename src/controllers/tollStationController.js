import { StatusCodes } from 'http-status-codes'
import { tollStationService } from '~/services/tollStationService'

const createNew = async (req, res, next) => {
  try {
    const createdTollLocation = await tollStationService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      createdTollLocation
    })

  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {

    const tollStation = await tollStationService.getDetail()

    res.status(StatusCodes.OK).json({ tollStation })
  } catch (error) {
    next(error)
  }
}

const getDetailId = async (req, res, next) => {
  try {
    const tollStationId = req.params.id
    const tollStation = await tollStationService.getDetailId(tollStationId)

    res.status(StatusCodes.OK).json({ tollStation })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const tollStationId = req.params.id
    const tollStation = await tollStationService.update(tollStationId, req.body)

    res.status(StatusCodes.OK).json({ tollStation })
  } catch (error) {
    next(error)
  }
}

const deleteStation = async (req, res, next) => {
  try {
    const tollStationId = req.params.id
    const tollStation = await tollStationService.deleteStation(tollStationId)

    res.status(StatusCodes.OK).json({ tollStation })
  } catch (error) {
    next(error)
  }
}

export const tollStationController = {
  createNew,
  getDetail,
  getDetailId,
  update,
  deleteStation
}