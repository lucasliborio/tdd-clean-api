import { serverError, ok } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'

interface sutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}
const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}
const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      name: 'valid_name',
      email: 'valid_email@hotmail.com',
      password: 'valid_pass',
      passwordConfirmation: 'valid_pass'
    }
  }
}
const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (req: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
  }
  return new ControllerStub()
}

const makeSut = (): sutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut, controllerStub, logErrorRepositoryStub
  }
}

describe('', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeHttpRequest())
  })

  test('Should return the same result off controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct  error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => { return makeFakeServerError() })
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle(makeHttpRequest())
    expect(logSpy).toBeCalled()
  })
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'anystacck'
  return serverError(fakeError)
}
