import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

describe('Load Account By Token usecase', () => {
  interface SutTypes {
    sut: LoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }
  const makeFakeAccount = (): AccountModel => {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  }
  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      constructor (private readonly secret: string) {}
      decrypt (token: string): string {
        return 'any_token'
      }
    }
    return new DecrypterStub('any_secret')
  }
  const makeLoadAccountByToken = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
      constructor (private readonly secret: string) {}
      async loadByToken (token: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByTokenRepositoryStub('any_secret')
  }
  const makeSut = (): SutTypes => {
    const loadAccountByTokenRepositoryStub = makeLoadAccountByToken()
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
      sut,
      decrypterStub,
      loadAccountByTokenRepositoryStub
    }
  }
  test('should call decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const result = await sut.load('any_token')
    expect(result).toBeNull()
  })
  test('should throws if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const result = sut.load('any_token')
    await expect(result).rejects.toThrow()
  })
  test('should call LoadByTokenRepository.loadByToken with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'role')
    expect(loadSpy).toHaveBeenCalledWith('any_token', 'role')
  })
  test('should throws if LoadByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(() => { throw new Error() })
    const result = sut.load('any_token')
    await expect(result).rejects.toThrow()
  })
})
