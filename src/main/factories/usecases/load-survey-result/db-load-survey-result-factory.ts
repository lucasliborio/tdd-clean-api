import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-repository'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
export const makeLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultRespository = new SurveyResultMongoRepository()
  const surverRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultRespository, surverRepository)
}
