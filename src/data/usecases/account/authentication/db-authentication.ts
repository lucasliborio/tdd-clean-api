import { AuthenticationModel } from '@/domain/models/authentication'
import { Authentication, HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository, AuthenticationParams } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparerAdapter: HashComparer
  private readonly jwtAdapter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparerAdapter: HashComparer, jwtAdapter: Encrypter, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparerAdapter = hashComparerAdapter
    this.jwtAdapter = jwtAdapter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const comparePasswords = await this.hashComparerAdapter.compare(authentication.password, account.password)
      if (comparePasswords) {
        const token = this.jwtAdapter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
        return {
          accessToken: token,
          name: account.name
        }
      }
    }
    return null
  }
}
