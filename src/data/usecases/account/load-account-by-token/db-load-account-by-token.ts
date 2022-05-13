import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly LoadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const validationToken = this.decrypter.decrypt(accessToken)

    if (validationToken) {
      const accountByToken = await this.LoadAccountByTokenRepository.loadByToken(accessToken, role)
      if (accountByToken) return accountByToken
    }
    return null
  }
}
