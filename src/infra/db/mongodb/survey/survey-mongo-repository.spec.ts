import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})
const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveryCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveryCollection = await MongoHelper.getCollection('surveys')
    await surveryCollection.deleteMany({})
  })

  describe('Add Surveys Repository', () => {
    test('should return an account on sucess', async () => {
      const sut = makeSut()
      await sut.addNewSurvey(makeFakeSurvey())
      const result = await surveryCollection.insertOne(makeFakeSurvey())
      const resultSearch = await surveryCollection.findOne({ _id: result.insertedId })
      expect(resultSearch.question).toBe('any_question')
    })
    test('should return an account on add sucess', async () => {

    })

    test('should update the count acesstoken on updateAcessToken Sucess', async () => {

    })
  })
  describe('Load Surveys Repository', () => {
    test('should return a list of repository', async () => {
      const sut = makeSut()
      await surveryCollection.insertOne(makeFakeSurvey())
      const result = await sut.loadSurveys()
      expect(result.length).toEqual(1)
    })
    test('should return a empty list', async () => {
      const sut = makeSut()
      const result = await sut.loadSurveys()
      expect(result.length).toEqual(0)
    })
  })
})
