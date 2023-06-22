import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import jsonWebToken from '../helpers/jwt-helper.js'

export default async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const cookieSchema = z.object({
    access_token: z.string()
  })
  const isValidCookieObject = cookieSchema.parse(req.cookies)
  if (isValidCookieObject) {
    const access_token: string = req.cookies['access_token']
    const userID = jsonWebToken.verify(access_token)
    if (userID === false) {
      res.status(401).json({
        error: 'login-check-failed',
        errMessage: 'Authorization failed'
      })
    }
    res.locals['userID'] = userID
    next()
  }
}
