import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

describe('Account Mongo repositor', () => {
  let accountCollection: Collection

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
  describe('add', () => {
    test('should return an account on sucess', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account).toHaveProperty('id')
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('loadByEmail()', () => {
    test('should return an account on add sucess', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('updateAccessToken', () => {
    test('should update the count acesstoken on updateAcessToken Sucess', async () => {
      const sut = new AccountMongoRepository()
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const resId = res.insertedId
      const findOneResult = await accountCollection.findOne({ _id: resId })
      await sut.updateAccessToken(res.insertedId.toString(), 'any_token')
      const findOneResultAfter = await accountCollection.findOne({ _id: findOneResult._id })
      expect(findOneResultAfter.accessToken).toBeTruthy()
    })
  })
  describe('loadByToken()', () => {
    test('should return an account on loadByToken without role', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'valid_token'
      })
      const account = await sut.loadByToken('valid_token')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('should return an account on loadByToken with role', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'valid_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('valid_token', 'admin')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
})
