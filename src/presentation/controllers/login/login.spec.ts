import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

describe('Login Controller', () => {
  const makeFakeRequest = (): HttpRequest => {
    return {
      body: {
        password: 'valid_password'
      }
    }
  }
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
