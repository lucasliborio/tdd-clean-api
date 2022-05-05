import { DbLoadAccountByToken } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adpter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../env'

export const makeLoadAccountByTokenUsecase = (): DbLoadAccountByToken => {
  const decrypterAdapter = new JwtAdapter(env.secret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypterAdapter, loadAccountByTokenRepository)
}
