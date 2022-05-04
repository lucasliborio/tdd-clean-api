import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly LoadAccountByToken: LoadAccountByToken
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const token = req.headers?.['x-access-token']
    if (token) {
      await this.LoadAccountByToken.load(token)
    }
    return forbidden(new AccessDeniedError())
  }
}
