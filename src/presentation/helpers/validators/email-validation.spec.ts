import { InvalidParamError, ServerError } from '../../errors'
import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols'
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

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // ESPIANDO O METODO SER CHAMADO PARA DEVOLVER O VALOR FALSE
    const httpResponse = sut.validate({ email: 'valid@email' })
    expect(httpResponse).toEqual(new InvalidParamError('email'))
  })

  test('Should call Emailvalidator with Correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'valid@email' })
    expect(isValidSpy).toBeCalledWith('valid@email')
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new ServerError('test') })
    expect(sut.validate).toThrow()
  })
})
