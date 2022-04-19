import { makeSignupValidation } from './signup-validtion-factory'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../util/email-validator-adapter'
import { CompareFieldsValidation, RequiredFieldsValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
