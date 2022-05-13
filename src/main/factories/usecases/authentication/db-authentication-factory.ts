import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication'
import { Authentication } from '@/domain/usecases/account/authentication'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adpter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/env'

export const makeDbAuthenticationFactory = (): Authentication => {
  const SALT = 12
  const accountRepository = new AccountMongoRepository()
  const bcrypAdapter = new BcryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.secret)
  return new DbAuthentication(accountRepository, bcrypAdapter, jwtAdapter, accountRepository)
}
