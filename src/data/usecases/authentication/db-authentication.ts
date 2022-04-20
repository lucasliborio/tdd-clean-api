import { Authentication, AuthenticationModel, HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparerAdapter: HashComparer
  private readonly tokenGenerator: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparerAdapter: HashComparer, tokenGenerator: Encrypter, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparerAdapter = hashComparerAdapter
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const comparePasswords = await this.hashComparerAdapter.compare(authentication.password, account.password)
      if (comparePasswords) {
        const token = await this.tokenGenerator.encrypt(account.id)
        await this.updateAccessTokenRepository.update(account.id, token)
        return token
      }
    }
    return null
  }
}
