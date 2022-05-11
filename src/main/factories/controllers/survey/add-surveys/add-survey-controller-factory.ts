import { makeSurveyValidation } from './add-survey-validation'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeAddSurveyUseCase } from '@/main/factories/usecases/add-survey/add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const validationComposite = makeSurveyValidation()
  const logRepo = new LogMongoRepository()
  const controller = new AddSurveyController(validationComposite, makeAddSurveyUseCase())
  return new LogControllerDecorator(controller, logRepo)
}
