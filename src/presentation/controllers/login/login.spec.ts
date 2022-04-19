import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, Authentication, Validation, AuthenticationModel } from './login-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: Controller
  authenticatetionStub: Authentication
  validationStub: Validation
}
const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'valid email',
      password: 'valid_password'
    }
  }
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticatetionStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticatetionStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticatetionStub = makeAuthentication()
  const sut = new LoginController(authenticatetionStub, validationStub)
  return {
    sut,
    authenticatetionStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('shoul call Authentication with correct values', async () => {
    const { sut, authenticatetionStub } = makeSut()
    const authSpy = jest.spyOn(authenticatetionStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: makeFakeRequest().body.email, password: makeFakeRequest().body.password })
  })

  test('should return with 401 if invalid credentaials are provided', async () => {
    const { sut, authenticatetionStub } = makeSut()
    jest.spyOn(authenticatetionStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if emailValidator throws', async () => {
    const { sut, authenticatetionStub } = makeSut()
    jest.spyOn(authenticatetionStub, 'auth').mockImplementationOnce(async () => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on valid request params', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ sucess: 'sucess' }))
  })
  test('should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 400 if dependency validation returs an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
