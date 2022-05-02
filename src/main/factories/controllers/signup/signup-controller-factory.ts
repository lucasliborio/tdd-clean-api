import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignupValidation } from './signup-validation-factory'
import { makeDbAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'

export const makeSignupController = (): Controller => {
  const salt = 12
  const bcrypAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoRepository)
  const validationComposite = makeSignupValidation()
  const signUpController = new SignUpController(dbAddAccount, validationComposite, makeDbAuthenticationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
