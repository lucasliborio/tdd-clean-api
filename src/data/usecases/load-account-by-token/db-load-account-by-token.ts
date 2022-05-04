import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly LoadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const validationToken = this.decrypter.decrypt(accessToken)
    if (validationToken) {
      const accountByToken = await this.LoadAccountByTokenRepository.loadByToken(validationToken, role)
      if (accessToken) return accountByToken
    }
    return null
  }
}
