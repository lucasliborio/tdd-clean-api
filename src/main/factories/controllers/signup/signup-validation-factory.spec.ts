import { makeSignupValidation } from './signup-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'

import { RequiredFieldsValidation, EmailValidation, CompareFieldsValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

jest.mock('../../../../validation/validators/validation-composite')

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
