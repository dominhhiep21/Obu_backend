/* eslint-disable no-useless-catch */
import { result } from 'lodash'
import { userModel } from '~/models/userModel'

const getAll = async () => {
  try {
    const users = await userModel.getAll()

    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user
      return safeUser
    })

    return { success: true, data: safeUsers }
  } catch (error) {
    throw error
  }
}


const getDetailId = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) return { success: false, message: 'This user is not exist' }
    const { password, ...safeUser } = user
    return { success: true, data: safeUser }
  } catch (error) {
    throw error
  }
}

const update = async (userId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedUser = await userModel.update(userId, updateData)
    const { password, ...safeUser } = updatedUser
    return safeUser
  } catch (error) {
    throw error
  }
}

const deleteUser = async (userId) => {
  try {
    await userModel.deleteOneById(userId)

    return { deleteResult: 'This user was deleted successfully' }
  } catch (error) {
    throw error
  }
}
export const userService = {
  getAll,
  update,
  deleteUser,
  getDetailId
}