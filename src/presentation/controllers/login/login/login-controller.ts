import { badRequest, unauthorized, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication
  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(req.body)
      if (error) return badRequest(error)
      const { email, password } = req.body
      const authenticationResponse = await this.authentication.auth({ email, password })
      if (!authenticationResponse?.accessToken) return unauthorized()
      return ok(authenticationResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
