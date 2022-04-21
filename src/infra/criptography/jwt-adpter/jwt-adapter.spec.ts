import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'valid_hash'
  }
}))

describe('JWT ADAPTER', () => {
  const makeSut = (): Encrypter => {
    return new JwtAdapter('secret')
  }
  test('should call jwt.sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('valid_id')
    expect(signSpy).toBeCalledWith({ id: 'valid_id' }, 'secret')
  })
  test('should return a token o sign sucess', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign')
    const accessToken = sut.encrypt('valid_id')
    expect(accessToken).toBe('valid_hash')
  })
  test('should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { return 'valid_hash' })
    const accessToken = sut.encrypt('valid_id')
    expect(accessToken).toBe('valid_hash')
  })
})
