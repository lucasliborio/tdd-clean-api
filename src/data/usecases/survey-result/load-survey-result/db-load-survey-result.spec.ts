import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyByIdRepository, SurveyModel } from '../../survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'valid_id',
    question: 'what tech do you know?',
    answers: [{
      answer: 'node'
    },
    {
      answer: 'python'
    },
    {
      answer: 'goolang'
    }],
    date: new Date()
  }
}
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
const makeSurveyRepo = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepoStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdRepoStub()
}
interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultStub: LoadSurveyResultRepository
  loadSurveyByIdStub: LoadSurveyByIdRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyResultStub = makeloadSurveyResultStub()
  const loadSurveyByIdStub = makeSurveyRepo()
  const sut = new DbLoadSurveyResult(loadSurveyResultStub, loadSurveyByIdStub)
  return { sut, loadSurveyResultStub, loadSurveyByIdStub }
}
describe('DB LoadSurveyResult usecase', () => {
  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyIdSpy = jest.spyOn(loadSurveyResultStub, 'loadResultBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyIdSpy).toBeCalledWith('any_survey_id')
  })
  test('should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null', async () => {
    const { sut, loadSurveyResultStub, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    jest.spyOn(loadSurveyResultStub, 'loadResultBySurveyId').mockResolvedValueOnce(null)
    await sut.load('any_survey_id')
    expect(loadByIdSpy).toBeCalledWith('any_survey_id')
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
