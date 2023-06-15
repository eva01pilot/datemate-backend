import type { Request, Response } from "express"
import prisma from '../../prisma/prisma-client.js'
export class UserController{
  getUser(req:Request, res:Response){
    res.status(200).json({
      ilya: 'yayaya'
    })
  }
  signUp(req:Request, res: Response){
    
  }
}
const userController = new UserController()
export default userController