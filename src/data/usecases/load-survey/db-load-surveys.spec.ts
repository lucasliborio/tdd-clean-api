
import { LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel } from '../../../domain/models/survey'
interface SutTypes {
  sut: LoadSurveys
  loadSurveysStub: LoadSurveysRepository
}
const makeSurveyRepo = (): LoadSurveysRepository => {
  class LoadSurveyRepoStub implements LoadSurveysRepository {
    async loadSurveys (): Promise<SurveyModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadSurveyRepoStub()
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeSurveyRepo()
  const sut = new DbLoadSurveys(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('DbLoadSurvey', () => {
  test('should call survey repo successfully', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveysRepoSpy = jest.spyOn(loadSurveysStub, 'loadSurveys')
    await sut.load()

    expect(loadSurveysRepoSpy).toBeCalled()
  })
})
