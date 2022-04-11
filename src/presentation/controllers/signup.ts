import { MissingParamError } from '../errors/missing-params'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  handle (req: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return {
      statusCode: 200,
      body: { sucess: 'user created sucefully' }
    }
  }
}
