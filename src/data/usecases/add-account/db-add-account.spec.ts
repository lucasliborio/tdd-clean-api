import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

export interface SubType {
  sut: DbAddAccount
  encrypterStub: Encrypter
}
const makeSut = (): SubType => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}
describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
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
