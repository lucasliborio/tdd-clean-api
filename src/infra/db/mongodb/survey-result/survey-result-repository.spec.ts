import { SurveyModel } from '@/domain/models/survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-repository'
import MockDate from 'mockdate'

let surveryCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection
const makeAccountInsert = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return res.insertedId.toString()
}

const makeSurveyInsert = async (): Promise<SurveyModel> => {
  const res = await surveryCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      image: 'any_image',
      answer: 'other_answer'
    }],
    date: new Date()
  })
  return MongoHelper.map(await surveryCollection.findOne({ _id: res.insertedId }) as unknown as SurveyModel)
}
const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}
beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  MockDate.set(new Date())
})

afterAll(async () => {
  await MongoHelper.disconnect()
  MockDate.reset()
})
beforeEach(async () => {
  surveryCollection = await MongoHelper.getCollection('surveys')
  await surveryCollection.deleteMany({})
  accountCollection = await MongoHelper.getCollection('account')
  await accountCollection.deleteMany({})
  surveyResultCollection = await MongoHelper.getCollection('surveyResult')
  await surveyResultCollection.deleteMany({})
})
describe('survey result repository', () => {
  test('should sucess on insert a new document if not existing', async () => {
    const sut = makeSut()
    const survey = await makeSurveyInsert()
    const accountId = await makeAccountInsert()
    const surveyResult = await sut.saveSurveyResult({
      surveyId: survey.id,
      accountId,
      answer: survey.answers[0].answer,
      date: new Date()
    })
    expect(surveyResult).toBeTruthy()
  })

  test('should sucess on update a existing documentt', async () => {
    const sut = makeSut()
    const survey = await makeSurveyInsert()
    const accountId = await makeAccountInsert()
    await surveyResultCollection.insertOne({
      surveyId: survey.id,
      accountId,
      answer: survey.answers[0].answer,
      date: new Date()
    })
    const surveyResult = await sut.saveSurveyResult({
      surveyId: survey.id,
      accountId,
      answer: 'any_answer',
      date: new Date()
    })

    expect(surveyResult).toBeTruthy()
    expect(surveyResult.answers[0].count).toEqual(1)
    expect(surveyResult.answers[0].percent).toEqual(100)
  })
  describe('loadResultBySurveyId()', () => {
  })
})
