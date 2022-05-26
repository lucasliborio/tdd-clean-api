import { SurveyModel } from '@/domain/models/survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-repository'

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
      answer: 'other_'
    }],
    date: new Date()
  })
  return MongoHelper.map(await surveryCollection.findOne({ _id: res.insertedId }) as unknown as SurveyModel)
}
const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('survey result repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveryCollection = await MongoHelper.getCollection('surveys')
    await surveryCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    await surveyResultCollection.deleteMany({})
  })
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
    /* console.log(await surveyResultCollection.find().toArray()) */
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
      answer: 'funcionou poha',
      date: new Date()
    })

    expect(surveyResult).toBeTruthy()
    expect(surveyResult).toHaveProperty('id')
  })
})

describe('loadResultBySurveyId()', () => {
  test('', () => {
  })
})
