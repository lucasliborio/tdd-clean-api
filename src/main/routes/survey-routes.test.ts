import { Collection } from 'mongodb'
import supertest from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { AddSurveyModel } from '../../presentation/controllers/survey/add-survey/add-survey-protocols'
import app from '../config/app'

let surveytCollection: Collection
describe('Survey routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveytCollection = await MongoHelper.getCollection('surveys')
    await surveytCollection.deleteMany({})
  })
  const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  })

  describe('POST /surveys ', () => {
    test('should return  204 on add survey withou access Token', async () => {
      await supertest(app)
        .post('/api/surveys')
        .send(makeFakeSurvey())
        .expect(403)
    })
  })
})
