import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

const mockLoadSurveyResult = ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer1',
      image: 'any_image1',
      count: 0,
      percent: 'any_percent1'
    },
    {
      answer: 'any_answer2',
      image: 'any_image2',
      count: 0,
      percent: 'any_percent2'
    }
  ],
  date: new Date()
})
const makeloadSurveyResultStub = (): LoadSurveyResultRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyResultRepository {
    async loadResultBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockLoadSurveyResult)
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
  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyIdSpy = jest.spyOn(loadSurveyResultStub, 'loadResultBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyIdSpy).toBeCalledWith('any_survey_id')
  })
  test('should throw if loadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'loadResultBySurveyId').mockRejectedValueOnce(new Error())
    const result = sut.load('any_survey_id')
    await expect(result).rejects.toThrow()
  })
  test('should return a SurveyResult on sucesss', async () => {
    const { sut } = makeSut()
    const result = await sut.load('any_survey_id')
    expect(result).toEqual(mockLoadSurveyResult)
  })
})
