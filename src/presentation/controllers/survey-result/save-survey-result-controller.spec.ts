import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, SurveyModel } from '../survey/load-survey/load-survey-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { SaveSurveyResult, SaveSurveyParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
const makeFakeParamsRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'node'
  },
  accountId: 'valid_account_id'
})
const makeFakeSurveyResultData = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'any_answer',
  date: new Date()
})
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
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}
const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResultData()))
    }
  }
  return new SaveSurveyResultStub()
}
interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}
const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResult()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut, loadSurveyByIdStub, saveSurveyResultStub
  }
}
describe('Save Survey Result Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call dependency LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(makeFakeParamsRequest())
    expect(loadSpy).toBeCalledWith('any_id')
  })
  test('should return forbidden if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const result = await sut.handle(makeFakeParamsRequest())
    expect(result).toEqual(forbidden(new InvalidParamError('survey_id')))
  })
  test('should return 500 if loadSurveyByIdThrows', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(async () => { return Promise.reject(new Error()) })
    const result = await sut.handle(makeFakeParamsRequest())
    expect(result).toEqual(serverError(new Error()))
  })
  test('should return 403 if a invalid answer is provided', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({
      params: {
        surveyId: 'valid_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(result).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('should call dependency SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const { accountId, body } = makeFakeParamsRequest()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeParamsRequest())

    expect(saveSpy).toBeCalledWith({
      surveyId: 'any_id',
      accountId: accountId,
      answer: body.answer,
      date: new Date()
    })
  })
  test('should return 500 if saveSurveyResult', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(async () => { return Promise.reject(new Error()) })
    const result = await sut.handle(makeFakeParamsRequest())
    expect(result).toEqual(serverError(new Error()))
  })
  test('should return 200 on sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeParamsRequest())
    expect(result).toEqual(ok(makeFakeSurveyResultData()))
  })
})
