import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbAuthenticationFactory } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(makeDbAuthenticationFactory(), validationComposite)
  const logoMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logoMongoRepository)
}
