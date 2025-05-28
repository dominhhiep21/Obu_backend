import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const getAll = async (req, res, next) => {
  try {
    const result = await userService.getAll()

    if (!result.success) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        message: result.message
      })
    }

    res.status(StatusCodes.OK).json({
      user: result.data
    })
  } catch (error) {
    next(error)
  }
}

const getDetailId = async (req, res, next) => {
  try {
    const userId = req.params.id
    const result = await userService.getDetailId(userId)

    if (!result.success) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        message: result.message
      })
    }

    res.status(StatusCodes.OK).json({
      user: result.data
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userService.update(userId, req.body)

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userService.deleteUser(userId)

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getAll,
  update,
  deleteUser,
  getDetailId
}