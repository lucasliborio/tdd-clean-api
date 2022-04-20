import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adpter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import env from '../../env'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const SALT = 12
  const accountRepository = new AccountMongoRepository()
  const bcrypAdapter = new BcryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.secret)
  const dbAuthentication = new DbAuthentication(accountRepository, bcrypAdapter, jwtAdapter, accountRepository)
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validationComposite)
  const logoMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logoMongoRepository)
}
