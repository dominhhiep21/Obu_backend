import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token is not valid' })
      }
      req.user = user
      //console.log('Decoded token:', user)
      next()
    })
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are not authenticated' })
  }
}

const verifyAuthAndAdminRole = (req, res, next) => {
  authHandlingMiddleware.authMiddleware(req, res, () => {
    //console.log(req.user.id)
    if (req.user.id == req.params.id || req.user.admin) {
      next()
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json('You do not have this permission with other users')
    }
  })
}
export const authHandlingMiddleware = {
  authMiddleware,
  verifyAuthAndAdminRole
}
