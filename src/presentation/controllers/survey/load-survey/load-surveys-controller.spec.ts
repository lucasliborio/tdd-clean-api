import { ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, LoadSurveys, SurveyModel } from './load-survey-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import MockDate from 'mockdate'
const makeFakeListSurvey = (): SurveyModel[] => {
  return [
    {
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
  ]
}
const makeLoadSurveyStub = (): LoadSurveys => {
  class LoadSurveyStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeListSurvey()))
    }
  }
  return new LoadSurveyStub()
}
interface SutTypes {
  sut: Controller
  loadSurveyStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurveyStub()
  const sut = new LoadSurveysController(loadSurveyStub)
  return {
    sut,
    loadSurveyStub
  }
}
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call LoadSurveys usecase', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSurveySpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(loadSurveySpy).toBeCalled()
  })
  test('should return 500 if loadSurvey usecase throws', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockRejectedValueOnce(new Error())
    const result = await sut.handle({})
    expect(result).toEqual(serverError(new Error()))
  })
  test('should return 200 if loadSurvey usecase', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeListSurvey()))
  })
})
