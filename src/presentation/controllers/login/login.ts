import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (req: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return ok({ sucess: 'sucess' })
  }
}
