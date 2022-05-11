import { makeSignupValidation } from './signup-validation-factory'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbAuthenticationFactory } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeDbAddAccountFactory } from '@/main/factories/usecases/add-account/db-add-account-factory'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'

export const makeSignupController = (): Controller => {
  const validationComposite = makeSignupValidation()
  const signUpController = new SignUpController(makeDbAddAccountFactory(), validationComposite, makeDbAuthenticationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
