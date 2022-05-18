import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'
import { makeLoadSurveyById } from '@/main/factories/usecases/load-survey-by-id/db-load-survey-by-id-factory'
import { makeSaveSurveyResult } from '@/main/factories/usecases/save-survey-result/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const loadById = makeLoadSurveyById()
  const saveSurveyResult = makeSaveSurveyResult()
  const controller = new SaveSurveyResultController(loadById, saveSurveyResult)
  const logRepo = new LogMongoRepository()
  return new LogControllerDecorator(controller, logRepo)
}
