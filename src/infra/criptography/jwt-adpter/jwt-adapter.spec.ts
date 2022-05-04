import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'valid_hash'
  },
  verify (): string {
    return 'valid_payload'
  }
}))

describe('JWT ADAPTER', () => {
  const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
  }
  describe('sign()', () => {
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
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { return new Error() })
      const accessToken = sut.encrypt('valid_id')
      expect(accessToken).toEqual(new Error())
    })
  })
  describe('verify()', () => {
    test('should call jwt verify with correct values', () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('valid_token')
      expect(verifySpy).toBeCalledWith('valid_token', 'secret')
    })
  })
})
