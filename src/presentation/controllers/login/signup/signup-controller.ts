import { AddAccount, Authentication, Controller, HttpRequest, HttpResponse, Validation } from './signup-protocols'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../errors'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(req.body)
      if (error) return badRequest(error)
      const { name, email, password, role } = req.body
      const account = await this.addAccount.add({
        name,
        email,
        password,
        role
      })
      if (!account) return forbidden(new EmailInUseError())
      const token = await this.authentication.auth({ email, password })
      return ok({ accessToken: token })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
