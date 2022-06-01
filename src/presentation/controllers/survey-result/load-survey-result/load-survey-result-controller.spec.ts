import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, SurveyModel } from '../../survey/load-survey/load-survey-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'

const mockFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_survey_id'
    }
  }
}
const mockFakeSurvey = (): SurveyModel => {
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
const mockSurveyResult = (): SurveyResultModel => ({
  surveyId: 'valid_survey_id',
  question: 'langueage most used',
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
})

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return Promise.resolve(mockFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}
const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (id: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultStub()
}
interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut, loadSurveyByIdStub, loadSurveyResultStub
  }
}
describe('LoadSurveyResult Controller', () => {
  test('Should call loadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(mockFakeRequest())
    expect(loadByIdSpy).toBeCalledWith('any_survey_id')
  })
  test('Should return unauthorized if LoadSurveyById return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const result = await sut.handle(mockFakeRequest())
    expect(result).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockRejectedValueOnce(new Error())
    const result = await sut.handle(mockFakeRequest())
    expect(result).toEqual(serverError(new Error()))
  })
  test('Should call loadSurveyResult with correctValues', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadResultSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockFakeRequest())
    expect(loadResultSpy).toBeCalledWith('any_survey_id')
  })
})
