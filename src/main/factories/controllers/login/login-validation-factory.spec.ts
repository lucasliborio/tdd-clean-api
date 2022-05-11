import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldsValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

jest.mock('@/validation/validators/validation-composite')

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
