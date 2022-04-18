import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  private readonly emailValidator
  private readonly authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!req.body[field]) return badRequest(new MissingParamError(field))
      }

      const { email, password } = req.body
      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))

      const acessToken = await this.authentication.auth(email, password)
      if (!acessToken) return unauthorized()
      return ok({ sucess: 'sucess' })
    } catch (error) {
      return serverError(error)
    }
  }
}
