import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../util/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSignupController = (): Controller => {
  const salt = 12
  const emailValidatorAdpter = new EmailValidatorAdapter()
  const bcrypAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdpter, dbAddAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
