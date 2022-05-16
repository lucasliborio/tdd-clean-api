import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { UnauthorizedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, SurveyModel } from '../survey/load-survey/load-survey-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

const makeFakeParamsRequest = (): HttpRequest => ({
  params: {
    survey_id: 'any_id'
  }
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
interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut, loadSurveyByIdStub
  }
}
describe('Save Survey Result Controller', () => {
  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(makeFakeParamsRequest())
    expect(loadSpy).toBeCalledWith('any_id')
  })
  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const result = await sut.handle(makeFakeParamsRequest())
    expect(result).toEqual(forbidden(new UnauthorizedError()))
  })
})
