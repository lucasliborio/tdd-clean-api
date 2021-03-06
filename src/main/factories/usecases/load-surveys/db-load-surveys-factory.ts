import { DbLoadSurveys } from '@/data/usecases/survey/load-survey/db-load-surveys'
import { LoadSurveys } from '@/domain/usecases/survey/load-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyRespository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyRespository)
}
