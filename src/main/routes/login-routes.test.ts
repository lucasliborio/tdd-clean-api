import supertest from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    test('should return statuCode 200 on sucess', async () => {
      await supertest(app)
        .post('/api/signup')
        .send({
          name: 'Lucas',
          email: 'lucas@gmail.com',
          password: 'valid',
          passwordConfirmation: 'valid'
        })
        .expect(200)
    })
  })
})
