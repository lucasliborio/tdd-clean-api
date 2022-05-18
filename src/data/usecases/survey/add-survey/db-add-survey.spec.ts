import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
describe('DB AddSurvey usecase', () => {
  interface SutTypes {
    sut: DbAddSurvey
    surveyRepositoryStub: AddSurveyRepository
  }
  const makeFakeSurvey = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: 'valid_date' as unknown as Date
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

  test('should call AddSurveyRepository  with correct values', async () => {
    const { sut, surveyRepositoryStub } = makeSut()
    const surverSpy = jest.spyOn(surveyRepositoryStub, 'addNewSurvey')
    await sut.add(makeFakeSurvey())
    expect(surverSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
  test('should throws if AddSurveyRepository throws', async () => {
    const { sut, surveyRepositoryStub } = makeSut()
    jest.spyOn(surveyRepositoryStub, 'addNewSurvey').mockImplementationOnce(() => { throw new Error() })
    const result = sut.add(makeFakeSurvey())
    await expect(result).rejects.toThrow()
  })
})
