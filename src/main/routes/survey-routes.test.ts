
import { Collection } from 'mongodb'
import supertest from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { AddSurveyModel } from '../../presentation/controllers/survey/add-survey/add-survey-protocols'
import app from '../config/app'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})
afterAll(async () => {
  await MongoHelper.disconnect()
})
beforeEach(async () => {
  surveytCollection = await MongoHelper.getCollection('surveys')
  await surveytCollection.deleteMany({})
  accountCollection = await MongoHelper.getCollection('account')
  await accountCollection.deleteMany({})
})
let surveytCollection: Collection
let accountCollection: Collection

describe('Survey routes', () => {
  const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })
  /* const mockAccessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
      name: 'Lucas',
      email: 'lucas@gmail.com',
      password: 'valid_hash',
      role: 'admin'
    })
    const id = res.insertedId.toHexString()
    const accessToken = sign({ id }, env.secret)
    await accountCollection.updateOne({
      _id: res.insertedId
    }, {
      $set: {
        accessToken
      }
    })
    return accessToken
  } */

  test('should return  403 on add survey withou access Token', async () => {
    await supertest(app)
      .post('/api/surveys')
      .send(makeFakeSurvey())
      .expect(403)
  })
  /* test('should return 204 on add survey with valid token', async () => {
    const accessToken = await mockAccessToken()
    await accountCollection.findOne({ accessToken })
    await supertest(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurvey())
      .expect(204)
  }) */
})
