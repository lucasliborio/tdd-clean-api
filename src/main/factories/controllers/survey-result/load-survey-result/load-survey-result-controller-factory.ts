import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeLoadSurveyById } from '@/main/factories/usecases/load-survey-by-id/db-load-survey-by-id-factory'
import { makeLoadSurveyResult } from '@/main/factories/usecases/load-survey-result/db-load-survey-result-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const loadSurveyById = makeLoadSurveyById()
  const loadSurveyResult = makeLoadSurveyResult()
  const controller = new LoadSurveyResultController(loadSurveyById, loadSurveyResult)
  return new LogControllerDecorator(controller, logMongoRepository)
}
