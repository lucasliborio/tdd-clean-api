import { Validation } from '../../../presentation/helpers/validators/validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidatorAdapter } from '../../../util/email-validator-adapter'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const fiels of ['email', 'password']) {
      validations.push(new RequiredFieldsValidation(fiels))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
