import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparerAdapter: HashComparer
  private readonly tokenGenerator: TokenGenerator
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparerAdapter: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparerAdapter = hashComparerAdapter
    this.tokenGenerator = tokenGenerator
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const comparePasswords = await this.hashComparerAdapter.compare(authentication.password, account.password)
    if (!comparePasswords) return null
  }
}
