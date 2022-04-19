import { RequiredFieldsValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'

import { EmailValidatorAdapter } from '../../../util/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []
  for (const fields of ['email', 'password']) {
    validations.push(new RequiredFieldsValidation(fields))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
