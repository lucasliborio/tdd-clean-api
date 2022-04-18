import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

describe('Login Controller', () => {
  const makeFakeRequest = (): HttpRequest => {
    return {
      body: {
        email: 'valid email',
        password: 'valid_password'
      }
    }
  }
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequestWithoutEmail = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequestWithoutEmail)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequestWithoutPassword = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequestWithoutPassword)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 200 on valid request params', async () => {
    const sut = new LoginController()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ sucess: 'sucess' }))
  })

  test('should return 200 on valid request params', async () => {
    const sut = new LoginController()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ sucess: 'sucess' }))
  })
})
