import { z } from "zod";
import type { Request, Response } from "express";

export const makeGetEndpoint = (cb: (req: Request, res: Response) => void, schema?: z.Schema) =>
  (req: Request, res: Response) => {
    if (schema) {
      const paramsResult = schema.safeParse(req.params)
      if (!paramsResult.success) {
        return res.status(400).json({
          error: 'validation-failed',
          errMessagfe: 'Ошибка валидации запроса'
        })
      }
    }
    cb(req, res)
  }

export const makePostEndpoint = (cb: (req: Request, res: Response) => void, schema?: z.Schema) =>
  (req: Request, res: Response) => {
    if (schema) {
      console.log(req.path)
      const paramsResult = schema.safeParse(req.body)
      if (!paramsResult.success) {
        return res.status(400).json({
          error: 'validation-failed',
          errMessage: `Ошибка валидации запроса: ${paramsResult.error.message}`
        })
      }
    }
    cb(req, res)
  }

export const cookieValidation = (cb: (req: Request, res: Response) => void, schema?: z.Schema,) =>
  (req: Request, res: Response) => {
    if (schema) {
      const paramsResult = schema.safeParse(req.cookies)

      if (!paramsResult.success) {
        return res.status(400).json({
          error: 'validation-failed',
          errMessage: `Ошибка валидации запроса: ${paramsResult.error.message}`
        })
      }
    }
    cb(req, res)
  }