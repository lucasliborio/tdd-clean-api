import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeLoadSurveyById = (): LoadSurveyById => {
  const loadByIdRepo = new SurveyMongoRepository()
  return new DbLoadSurveyById(loadByIdRepo)
}
