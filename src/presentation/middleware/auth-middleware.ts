import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly LoadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const token = req.headers?.['x-access-token']
      if (token) {
        const accountData = await this.LoadAccountByToken.load(token, this.role)
        if (accountData) {
          return ok({ accountId: accountData.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
