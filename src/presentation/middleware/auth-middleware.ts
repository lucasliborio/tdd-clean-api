import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly LoadAccountByToken: LoadAccountByToken
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const token = req.headers?.['x-access-token']
    if (token) {
      const accountData = await this.LoadAccountByToken.load(token)
      if (accountData) {
        return ok({ accountId: accountData.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
