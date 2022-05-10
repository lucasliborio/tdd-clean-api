import { Collection } from 'mongodb'
import supertest from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

// i have a problem with the supertest headers
let surveyCollection: Collection
let accountCollection: Collection
beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})
afterAll(async () => {
  await MongoHelper.disconnect()
})
beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')
  await surveyCollection.deleteMany({})
  accountCollection = await MongoHelper.getCollection('account')
  await accountCollection.deleteMany({})
})
/* const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}) */
/* const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Lucas',
    email: 'lucas@gmail.com',
    password: 'valid_hash'
  })
  const id = res.insertedId.toHexString()
  console.log(await accountCollection.findOne({ _id: new ObjectId(res.insertedId) }))
  const accessToken = sign({ id }, env.secret)
  await accountCollection.updateOne({
    _id: new ObjectId(id)
  }, {
    $set: {
      accessToken: accessToken
    }
  })
  console.log(await accountCollection.findOne({ _id: new ObjectId(res.insertedId) }))
  return accessToken
} */
describe('SURVEY ROUTES', () => {
  describe('POST /surveys', () => {
    test('should return  403 on add survey withou access Token', async () => {
      await supertest(app)
        .post('/api/surveys')
        .expect(403)
    })
  })
  describe('GET /surveys', () => {
    test('should return  403 on add survey withou access Token', async () => {
      await supertest(app)
        .get('/api/surveys')
        .expect(403)
    })
    /*  test('should return  204 on LoadSurvey with no surveys list', async () => {
      const accessToken = await mockAccessToken()
      await supertest(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    }) */
  })
})
// ERROR no MONGO
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

/* test('should return 204 on add survey with valid token', async () => {
    const accessToken = await mockAccessToken()
    await accountCollection.findOne({ accessToken })
    await supertest(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurvey())
      .expect(204)
  }) */
