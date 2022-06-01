import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, SurveyModel } from '../../survey/load-survey/load-survey-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'

const mockFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_survey_id'
    }
  }
}
const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return Promise.resolve(null)
    }
  }
  return new LoadSurveyByIdStub()
}
interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut, loadSurveyByIdStub
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
})
