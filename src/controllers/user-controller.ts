import { Request, Response } from "express";
import jsonWebToken from "../helpers/jwt-helper.js";
import prisma from "../../prisma/prisma-client.js";

class UserController {
  async getMe(req: Request, res: Response) {
    const access_token: string = req.cookies["access_token"];
    const userID = jsonWebToken.verify(access_token);
    if (userID === false) {
      return res.status(401).json({
        error: "login-check-failed",
        errMessage: "Authorization failed",
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: +userID,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        description: true,
        gallery: true,
      },
    });

    const interests = await prisma.interest.findMany({
      where: {
        User: {
          some: {
            id: +userID,
          },
        },
      },
    });
    return res.status(200).json({
      data: {
        user: {
          ...user,
          interests,
        },
      },
    });
  }

  async update(req: Request, res: Response) {
    const userID = res.locals["userID"];
    const {
      username,
      avatar,
      gallery,
      description,
      interests,
    }: {
      username: string;
      avatar: string | null;
      gallery: any;
      description: string | null;
      interests: number[] | undefined;
    } = req.body;

    const updateRes = await prisma.user.update({
      data: {
        avatar,
        description:description,
        gallery: gallery ?? undefined,
        username,
        interests: {
          connect: interests?.map(interest=>({id:interest}))
        }
      },
      where: {
        id: +userID
      }
    })
    return res.status(200).json({
      data: {
        user: {
          ...updateRes
        }
      }
    })
  }

}

const userController = new UserController();

export default userController;
