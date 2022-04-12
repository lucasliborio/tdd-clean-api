import { DbAddAccount } from './db-add-account'
describe('DbAddAccount UseCase', () => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  test('Should call Encrypter with correct password', async () => {
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptspy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_name@mail.com',
      password: 'valid_password'

    }
    await sut.add(accountData)
    expect(encryptspy).toHaveBeenCalledWith('valid_password')
  })
})
