import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignupValidation } from './signup-validation-factory'
import { makeDbAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccountFactory } from '../../usecases/add-account/db-add-account-factory'

export const makeSignupController = (): Controller => {
  const validationComposite = makeSignupValidation()
  const signUpController = new SignUpController(makeDbAddAccountFactory(), validationComposite, makeDbAuthenticationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
