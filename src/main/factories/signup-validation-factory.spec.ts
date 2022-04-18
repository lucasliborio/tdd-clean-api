import { makeSignupValidation } from './signup-validtion-factory'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { EmailValidator } from '../../presentation/protocols'

jest.mock('../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const fiels of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidation(fiels))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
