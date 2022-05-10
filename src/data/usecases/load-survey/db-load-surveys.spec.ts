
import { LoadSurveys, LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'

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
interface SutTypes {
  sut: LoadSurveys
  loadSurveyRepoStub: LoadSurveysRepository
}
const makeSurveyRepo = (): LoadSurveysRepository => {
  class LoadSurveyRepoStub implements LoadSurveysRepository {
    async loadSurveys (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeListSurvey()))
    }
  }
  return new LoadSurveyRepoStub()
}
const makeSut = (): SutTypes => {
  const loadSurveyRepoStub = makeSurveyRepo()
  const sut = new DbLoadSurveys(loadSurveyRepoStub)
  return {
    sut,
    loadSurveyRepoStub
  }
}

describe('DbLoadSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call survey repository successfully', async () => {
    const { sut, loadSurveyRepoStub } = makeSut()
    const loadSurveysRepoSpy = jest.spyOn(loadSurveyRepoStub, 'loadSurveys')
    await sut.load()
    expect(loadSurveysRepoSpy).toBeCalled()
  })
  test('should throws if loadSurvey repository thorws', async () => {
    const { sut, loadSurveyRepoStub } = makeSut()
    jest.spyOn(loadSurveyRepoStub, 'loadSurveys').mockRejectedValueOnce(new Error())
    const result = sut.load()
    await expect(result).rejects.toThrow()
  })
  test('should return a list of surveys on success', async () => {
    const { sut, loadSurveyRepoStub } = makeSut()
    jest.spyOn(loadSurveyRepoStub, 'loadSurveys')
    const result = sut.load()
    await expect(result).resolves.toEqual(makeFakeListSurvey())
  })
})
