import { InvalidParamError, MissingParamError, UnauthorizedError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, Authentication } from './login-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: Controller
  emailValidatorStub: EmailValidator
  authenticatetionStub: Authentication
}
const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'valid email',
      password: 'valid_password'
    }
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticatetionStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticatetionStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticatetionStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticatetionStub)
  return {
    sut,
    emailValidatorStub,
    authenticatetionStub
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequestWithoutEmail = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequestWithoutEmail)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequestWithoutPassword = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequestWithoutPassword)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if an invalid email is provides', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(emailValidatorSpy).toBeCalledWith(makeFakeRequest().body.email)
  })

  test('should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('shoul call Authentication with correct values', async () => {
    const { sut, authenticatetionStub } = makeSut()
    const authSpy = jest.spyOn(authenticatetionStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith(makeFakeRequest().body.email, makeFakeRequest().body.password)
  })

  test('should return with 401 if invalid credentaials are provided', async () => {
    const { sut, authenticatetionStub } = makeSut()
    jest.spyOn(authenticatetionStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new UnauthorizedError()))
  })

  test('should return 200 on valid request params', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ sucess: 'sucess' }))
  })
})
