import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

const makeloadSurveyResultStub = (): LoadSurveyResultRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyResultRepository {
    async loadResultBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(null)
    }
  }
  return new LoadSurveyRepositoryStub()
}
interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultStub: LoadSurveyResultRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyResultStub = makeloadSurveyResultStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultStub)
  return { sut, loadSurveyResultStub }
}
describe('DB LoadSurveyResult usecase', () => {
  test('should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyIdSpy = jest.spyOn(loadSurveyResultStub, 'loadResultBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyIdSpy).toBeCalledWith('any_survey_id')
  })
  test('should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyIdSpy = jest.spyOn(loadSurveyResultStub, 'loadResultBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyIdSpy).toBeCalledWith('any_survey_id')
  })
})
