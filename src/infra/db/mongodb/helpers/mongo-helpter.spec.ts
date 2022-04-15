import { MongoHelper as sut } from './mongo-helper'

describe('', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Should reconnect if mongodb is down', async () => {
    let accoutCollection = await sut.getCollection('accounts')
    expect(accoutCollection).toBeTruthy()
    await sut.disconnect()
    accoutCollection = await sut.getCollection('accounts')
    expect(accoutCollection).toBeTruthy()
  })
})
