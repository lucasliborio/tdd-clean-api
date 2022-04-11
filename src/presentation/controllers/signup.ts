import { MissingParamError } from '../errors/missing-params'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (req: HttpRequest): HttpResponse {
    if (!req.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!req.body.email) {
      return badRequest(new MissingParamError('email'))
    }
    return {
      statusCode: 200,
      body: { sucess: 'user created' }
    }
  }
}
