import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('valid_hash'))
  }
}))

describe('JWT ADAPTER', () => {
  const makeSut = (): Encrypter => {
    return new JwtAdapter('secret')
  }
  test('should call jwt.sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('valid_id')
    expect(signSpy).toBeCalledWith({ id: 'valid_id' }, 'secret')
  })
})
