import { makeSignupValidation } from './signup-validtion-factory'
import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../util/email-validator-adapter'

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
