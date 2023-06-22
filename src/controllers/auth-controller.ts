import type { Request, Response } from "express"
import prisma from '../../prisma/prisma-client.js'
import jsonWebToken from '../helpers/jwt-helper.js'
import crypt from '../helpers/crypt-hashing.js'

export class AuthController {

  async login(req: Request, res: Response) {

    const { username, password }: { username: string, password: string } = req.body
    const passwordHashed = await crypt.hash(password)

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username
        }
      },
      select: {
        username: true,
        password: true,
        avatar: true,
      }
    })

    if (!user || !(user.password === passwordHashed)) {
      return res.status(401).json({
        err: 'login-failed',
        errMessage: 'Неправильный логин или пароль',
      })
    }

    return res.status(200).json({
      data: {
        user: {
          username: user.username,
          avatar: user.avatar,
        }
      }
    })
  }
  async verifyLogin(req: Request, res: Response) {
    const access_token: string = req.cookies['access_token']
    const userID = jsonWebToken.verify(access_token)
    if (userID === false) {
      return res.status(401).json({
        error: 'login-check-failed',
        errMessage: 'Authorization failed'
      })
    }
    const user = await prisma.user.findFirst({
      where: {
        id: +userID
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        desctiption: true,
        gallery: true,
      }
    });
    return res.status(200).json({
      data: {
        user
      }
    })

  }

  async signUp(req: Request, res: Response) {
    const { username, password }: { username: string, password: string } = req.body
    const passwordHashed = await crypt.hash(password)

    const user = await prisma.user.create({
      data: {
        username,
        password: passwordHashed,
      },
      select: {
        id: true,
        username: true
      }
    });

    res.cookie('access_token', jsonWebToken.sign(user.id))
    return res.status(200).json({
      data: {
        user,
      }
    })
  }
}
const authController = new AuthController()
export default authController
