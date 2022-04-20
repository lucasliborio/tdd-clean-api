import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Authentication } from '../../../domain/usecases/authentication'
import { Validation } from './login-protocols'

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
      const acessToken = await this.authentication.auth({ email, password })
      if (!acessToken) return unauthorized()
      return ok(acessToken)
    } catch (error) {
      return serverError(error)
    }
  }
}
