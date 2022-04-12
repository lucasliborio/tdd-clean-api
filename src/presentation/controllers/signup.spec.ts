import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'
import { AddAccountModel, AddAccount } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'

/* const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new ServerError()
    }
  }
  return new EmailValidatorStub()
} */
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'lucas@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio@hotmail',
        email: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        password: 'any_password',
        email: 'any_email@hotmail.com'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        email: 'invalid_email@hotmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // ESPIANDO O METODO SER CHAMADO PARA DEVOLVER O VALOR FALSE
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call Emailvalidator with Correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        email: 'invalid_email@hotmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('invalid_email@hotmail.com')
  })
  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new ServerError() })
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        email: 'invalid_email@hotmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        email: 'invalid_email@hotmail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'lucas Liborio',
        email: 'invalid_email@hotmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    sut.handle(httpRequest)
    expect(addAccountSpy).toBeCalledWith({
      name: 'lucas Liborio',
      email: 'invalid_email@hotmail.com',
      password: 'any_password'
    })
  })
})
