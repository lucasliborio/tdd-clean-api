import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email } = req.body
    if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))
    return ok({ sucess: 'sucess' })
  }
}
