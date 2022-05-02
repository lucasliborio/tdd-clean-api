import { Validation } from '../../../../presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'
import { RequiredFieldsValidation, EmailValidation, ValidationComposite } from '../../../../presentation/helpers/validators'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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
