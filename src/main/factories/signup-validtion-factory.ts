import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignupValidation = (): Validation => {
  const validations: Validation[] = []
  for (const fiels of ['name', 'email', 'password', 'validation']) {
    validations.push(new RequiredFieldsValidation(fiels))
  }
  return new ValidationComposite(validations)
}
