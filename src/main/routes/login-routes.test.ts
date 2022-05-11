import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import supertest from 'supertest'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('should return statuCode 200 on signup', async () => {
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
  describe('POST /login', () => {
    test('should return statuCode 200 on login', async () => {
      const password = await hash('valid', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'lucas@gmail.com',
        password: password
      })
      await supertest(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: 'valid'
        })
        .expect(200)
    })

    test('should return statuCode 401 on login', async () => {
      await supertest(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: 'valid'
        })
        .expect(401)
    })
  })
})
