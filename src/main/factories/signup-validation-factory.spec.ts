import { makeSignupValidation } from './signup-validtion-factory'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const fiels of ['name', 'email', 'password', 'validation']) {
      validations.push(new RequiredFieldsValidation(fiels))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
