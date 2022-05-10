import { LogMongoRepository } from '../../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-surveys-controller'
import { Controller } from '../../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../../decorators/log-controller-decorator'
import { makeDbLoadSurveys } from '../../../usecases/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const dbLoadSurvey = makeDbLoadSurveys()
  const logMongoRepository = new LogMongoRepository()
  const controller = new LoadSurveysController(dbLoadSurvey)

  return new LogControllerDecorator(controller, logMongoRepository)
}
