import supertest from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

describe('SignUp Router', () => {
  test('should return an account on sucess', async () => {
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
