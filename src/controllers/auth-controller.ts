import type { Request, Response } from "express"
import prisma from '../../prisma/prisma-client.js'
import jsonWebToken from '../helpers/jwt-helper.js'
import crypt from '../helpers/crypt-hashing.js'

export class AuthController {

  async login(req: Request, res: Response) {

    const { username, password }: { username: string, password: string } = req.body
    
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username
        }
      },
      select: {
        id: true,
        username: true,
        password: true,
        avatar: true,
      }
    })
    if(!user) {
      return res.status(401).json({
        err: 'login-failed',
        errMessage: 'Неправильный логин или пароль',
      })
    }
    const isValid = await crypt.compare(password, user?.password)
    if (!isValid) {
      return res.status(401).json({
        err: 'login-failed',
        errMessage: 'Неправильный логин или пароль',
      })
    }
    res.cookie('access_token', jsonWebToken.sign(user.id), {
      httpOnly: true
    })
    return res.status(200).json({
      data: {
        user: {
          username: user.username,
          avatar: user.avatar,
        }
      }
    })
  }


  async signUp(req: Request, res: Response) {
    const { username, password }: { username: string, password: string } = req.body
    const passwordHashed = await crypt.hash(password)

    const existingUser = await prisma.user.findFirst({
      where: {
        username: username
      }
    })

    if(existingUser) {
      return res.status(400).json({
        error: 'signup-error',
        errMessage: 'Имя пользователя уже существует'
      })
    }

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

    res.cookie('access_token', jsonWebToken.sign(user.id), {
      httpOnly: true
    })
    return res.status(200).json({
      data: {
        user,
      }
    })
  }
}
const authController = new AuthController()
export default authController
