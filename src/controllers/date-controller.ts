import type { Request, Response } from 'express'
import prisma from '../../prisma/prisma-client.js'

class DateController {

  async getUser(req: Request, res: Response) {

    const { userID } = req.params
    const user = await prisma.user.findFirst({
      where: {
        id: {
          equals: +userID
        }
      },
      select: {
        avatar: true,
        gallery: true,
        username: true,
        desctiption: true
      }
    });

    return res.status(200).json({
      data: {
        user
      }
    })
  }

  async getDates(_req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        avatar: true,
        gallery: true,
        username: true,
        desctiption: true,
      }
    });
    return res.status(200).json({
      data: {
        users
      }
    })

  }

  async likePerson(req: Request, res: Response) {
    const userID = res.locals['userID']
    await prisma.like.create({
      data: {
        likedBy: {
          connect: {
            id: userID
          }
        },
        liked: {
          connect: {
            id: req.body['id']
          }
        },
        datetime: new Date()
      },
    });
    const likesByCurrentUser = await prisma.like.findFirst({
      where: {
        likedById: userID
      },
      select: {
        id: true,
      }
    });

    const likesByTargetUser = await prisma.like.findFirst({
      where: {
        likedById: req.body['id']
      },
      select: {
        id: true,
      }
    });

    const isMatch = !!likesByCurrentUser?.id && !!likesByTargetUser?.id;

    if (!isMatch) {
      return res.status(200).json({
        data: {
          result: 'success'
        }
      })
    }

    const match = await prisma.match.create({
      data: {
        firstPersonId: userID,
        secondPersonId: req.body['id'],
        datetime: new Date()
      }
    })
    return res.status(200).json({
      data: {
        match
      }
    })
  }

  async getLikes(_req: Request, res: Response) {
    const userID = res.locals['userID']

    const likesUserIDs = await prisma.like.findMany({
      where: {
        likedById: userID
      },
      select: {
        likedId: userID
      }
    })
    const likesUsers = await prisma.user.findMany({
      where: {
        id: {
          in: likesUserIDs.map(el => el.likedId)
        }
      },
      select: {
        username: true,
        id: true,
        desctiption: true,
        avatar: true,
        gallery: true,
      }
    })
    return res.status(200).json({
      data: {
        likesUsers
      }
    })
  }

  async getMatches(_req: Request, res: Response) {
    const userId = res.locals['userID']

    const matches = await prisma.match.findMany({
      where: {
        firstPersonId: userId,
        OR: {
          secondPersonId: userId
        }
      },
      select: {
        firstPersonId: true,
        secondPersonId: true,
      }
    })

    const matchesWithOnlyTarget = matches.map((elem) =>
      elem.firstPersonId === userId ? elem.secondPersonId : elem.firstPersonId
    )
    const usersMatches = await prisma.user.findMany({
      where: {
        id: {
          in: matchesWithOnlyTarget
        }
      },
      select: {
        username: true,
        id: true,
        desctiption: true,
        avatar: true,
        gallery: true,
      }
    })
    return res.status(200).json({
      data: {
        usersMatches
      }
    })

  }
}

const dateController = new DateController()

export default dateController
