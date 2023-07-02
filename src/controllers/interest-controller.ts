import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client.js";

class InterestController {
  async getAllInterests(_req: Request, res: Response) {
    const categories = await prisma.categoryOfInterest.findMany({
      select: {
        id: true,
        name: true,
        interests: true
      }
    })
    
    res.status(200).json({
      data: {
        categories
      }
    })
  }
}

const interestController = new InterestController()

export default interestController