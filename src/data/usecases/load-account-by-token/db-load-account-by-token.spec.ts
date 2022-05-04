import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
describe('Load Account By Token usecase', () => {
  interface SutTypes {
    sut: LoadAccountByToken
    decrypterStub: Decrypter
  }
  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      constructor (private readonly secret: string) {}
      decrypt (token: string): string {
        return 'any_id'
      }
    }
    return new DecrypterStub('any_secret')
  }
  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return {
      sut,
      decrypterStub
    }
  }
  test('should call decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })
  test('should call decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })
})
