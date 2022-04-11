import { MissingParamError } from '../errors/missing-params'
import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle (req: HttpRequest): HttpResponse {
    if (!req.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (!req.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
    return {
      statusCode: 200,
      body: { sucess: 'user created' }
    }
  }
}
