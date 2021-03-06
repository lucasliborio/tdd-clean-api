import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { forbidden, serverError, ok } from '../helpers/http/http-helper'
import { LoadAccountByToken, AccountModel, HttpRequest, Middleware } from './auth-middleware-protocols'

describe('Auth middleware', () => {
  const makeFakeAccount = (): AccountModel => {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  }
  const makeFakeRequest = (): HttpRequest => {
    return {
      headers: {
        'x-access-token': 'any_token'
      }
    }
  }
  interface SutTypes {
    sut: Middleware
    loadAccountByTokenStub: LoadAccountByToken
  }
  const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByTokenStub()
  }
  const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
    return {
      sut,
      loadAccountByTokenStub
    }
  }
  test('should return 403 if no x-acess-token exitst in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call loadAccountBytoken with correct token', async () => {
    const role = undefined
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toBeCalledWith('any_token', role)
  })
  test('should return 403 if LoadAccountByToken Returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValue(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should return 403 if LoadAccountByToken Returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should return 200 if LoadAccountBytoken return an account', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })
})
