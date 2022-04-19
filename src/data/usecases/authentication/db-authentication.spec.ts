import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

interface SutTypes {
  sut: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}
const makeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
}
const makeFakeAuthenticationModel = (): AuthenticationModel => {
  return {
    email: 'valid_email',
    password: 'valid_password'
  }
}
const makeHashCompare = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hashPassword: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}
const makeTokenGenareStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return new Promise(resolve => resolve('valid_toke'))
    }
  }
  return new TokenGeneratorStub()
}
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenareStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('', () => {
  test('Should call LoadAccountByEmailrepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthenticationModel())
    expect(loadSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if LoadAccountByEmailRepository Thorws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if no Account is found on loadAccountByEmailRepository', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBe(null)
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith('valid_password', 'hashed_password')
  })

  test('Should return null if hashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const sutSpy = await sut.auth(makeFakeAuthenticationModel())
    expect(sutSpy).toBe(null)
  })
  test('Should throws if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const sutSpy = sut.auth(makeFakeAuthenticationModel())
    await expect(sutSpy).rejects.toEqual(new Error())
  })

  test('Should call TokenGenerator with correct ID', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthenticationModel())
    expect(generateSpy).toHaveBeenCalledWith('valid_id')
  })
})
