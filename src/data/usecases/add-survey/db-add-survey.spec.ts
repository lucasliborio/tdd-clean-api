import { AddSurveyModel } from '../../../domain/usecases/add-survey'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'
describe('DB AddSurvey usecase', () => {
  interface SutTypes {
    sut: DbAddSurvey
    surveyRepositoryStub: AddSurveyRepository
  }
  const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  })

  const makeSurveyRepo = (): AddSurveyRepository => {
    class SurveryRepoStub implements AddSurveyRepository {
      async addNewSurvey (): Promise<void> {
        return new Promise(resolve => resolve(null))
      }
    }
    return new SurveryRepoStub()
  }
  const makeSut = (): SutTypes => {
    const surveyRepositoryStub = makeSurveyRepo()
    const sut = new DbAddSurvey(surveyRepositoryStub)
    return {
      sut,
      surveyRepositoryStub
    }
  }

  test('should call infra layer with correct values', async () => {
    const { sut, surveyRepositoryStub } = makeSut()
    const surverSpy = jest.spyOn(surveyRepositoryStub, 'addNewSurvey')
    await sut.add(makeFakeSurvey())
    expect(surverSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
})
