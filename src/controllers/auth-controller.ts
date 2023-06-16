import type { Request, Response } from "express"
import prisma from '../../prisma/prisma-client.js'
import { z } from 'zod'
import jsonWebToken from '../helpers/jwt-helper.js'
import crypt from '../helpers/crypt-hashing.js'

export class AuthController {

  async login(req: Request, res: Response) {
    const loginSchema = z.object({
      username: z.string(),
      password: z.string()
    })
    const isValidLoginObject = loginSchema.parse(req.body)

    if (!isValidLoginObject) {
      res.status(401).json({
        error: 'login-failed',
        errMessage: 'Неправильный формат данных'
      })
    }

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

    if(!user || !(user.password === passwordHashed)){
      res.status(401).json({
        err: 'login-failed',
        errMessage: 'Неправильный логин или пароль',
      })
    }

    res.status(200).json({
      data: {
        user: {
          username: user.username,
          avatar: user.avatar,
        }
      }
    })
  }
  async verifyLogin(req: Request, res: Response) {
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
      const user = await prisma.user.findFirst({
        where: {
          id: +userID
        },
        select: {
          username: true,
          avatar: true,
          desctiption: true,
          gallery: true,
          likedBy: true,
          likes: true,
          messagesReceived: true,
          messagesSent: true
        }
      });
      res.status(200).json({
        data: {
          user
        }
      })
    }
  }

  async signUp(req: Request, res: Response) {
    const signUpSchema = z.object({
      username: z.string().max(20),
      password: z.string()
    })

    const isValid = signUpSchema.parse(req.body)

    if (!isValid) {
      res.status(422).json({
        error: 'signup-fail',
        errMessage: 'Неправильный формат логина или пароля'
      })
    }

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
    res.status(200).json({
      data: {
        user,
      }
    })
  }
}
const authController = new AuthController()
export default authController