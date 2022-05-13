import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyModel } from '@/presentation/controllers/survey/load-survey/load-survey-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import MockDate from 'mockdate'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

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
const makeSurveyRepo = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepoStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdRepoStub()
}
interface SutTypes {
  sut: LoadSurveyById
  loadSurveyByIdRepoStub: LoadSurveyByIdRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdRepoStub = makeSurveyRepo()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepoStub)
  return {
    sut,
    loadSurveyByIdRepoStub
  }
}
describe('DbLoadSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call LoadSurveyByIdRepository successfully', async () => {
    const { sut, loadSurveyByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepoStub, 'loadById')
    await sut.load('valid_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('valid_id')
  })
  test('should call throws if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepoStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepoStub, 'loadById').mockRejectedValueOnce(new Error())
    const result = sut.load('valid_id')
    await expect(result).rejects.toThrow()
  })
  test('should return a survey on sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.load('valid_id')
    expect(result).toEqual(makeFakeSurvey())
  })
})
