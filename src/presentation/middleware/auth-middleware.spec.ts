import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { Middleware } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
describe('Auth middleware', () => {
  const makeFakeAccount = (): AccountModel => {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  }
  interface SutTypes {
    sut: Middleware
    loadAccountByTokenStub: LoadAccountByToken
  }
  const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (acessToken: string, role?: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByTokenStub()
  }
  const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
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
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toBeCalledWith('any_token')
  })
})
