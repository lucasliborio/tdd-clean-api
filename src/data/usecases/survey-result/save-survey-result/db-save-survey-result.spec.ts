import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyParams } from '@/domain/usecases/survey-result/save-survey-result'
import { DbSaveSurveyResult } from './db-save-survey-result'

import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'

const makeFakeSurveyResultData = (): SaveSurveyParams => ({
  accountId: 'valid_account_id',
  surveyId: 'valid_survey_id',
  answer: 'any_answer',
  date: new Date()
})
const makeFakeSurveyResult = (): SurveyResultModel => Object.assign(makeFakeSurveyResultData(), { id: 'valid_id' })

const makeSurveyRepo = (): SaveSurveyResultRepository => {
  class SaveSurveyRepoStub implements SaveSurveyResultRepository {
    async saveSurveyResult (data: SaveSurveyParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyRepoStub()
}
interface SutTypes {
  sut: SaveSurveyResult
  saveSurveyRepoStub: SaveSurveyResultRepository
}
const makeSut = (): SutTypes => {
  const saveSurveyRepoStub = makeSurveyRepo()
  const sut = new DbSaveSurveyResult(saveSurveyRepoStub)
  return {
    sut,
    saveSurveyRepoStub
  }
}
describe('DbSaveSurveyResult usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call SaveSurveyResult repository with correct values', async () => {
    const { sut, saveSurveyRepoStub } = makeSut()
    const saveSurveySpy = jest.spyOn(saveSurveyRepoStub, 'saveSurveyResult')
    await sut.save(makeFakeSurveyResultData())
    expect(saveSurveySpy).toBeCalledWith(makeFakeSurveyResultData())
  })
  test('should throws if SaveSurvey', async () => {
    const { sut, saveSurveyRepoStub } = makeSut()
    jest.spyOn(saveSurveyRepoStub, 'saveSurveyResult').mockRejectedValueOnce(new Error())
    const resultSut = sut.save(makeFakeSurveyResultData())
    await expect(resultSut).rejects.toThrow()
  })
  test('should return surveyResult on success', async () => {
    const { sut } = makeSut()
    const result = await sut.save(makeFakeSurveyResultData())
    expect(result).toEqual(makeFakeSurveyResult())
  })
})
