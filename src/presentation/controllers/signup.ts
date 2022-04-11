import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle (req: HttpRequest): HttpResponse {
    if (!req.body.name) {
      return {
        statusCode: 400,
        body: new Error('missing param: name')
      }
    }
    if (!req.body.email) {
      return {
        statusCode: 400,
        body: new Error('missing param: email')
      }
    }
    return {
      statusCode: 200,
      body: { sucess: 'user created' }
    }
  }
}
