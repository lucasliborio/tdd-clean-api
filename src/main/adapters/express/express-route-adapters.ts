import { Request, Response } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
