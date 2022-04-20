import { CompareFieldsValidation, RequiredFieldsValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

export const makeSignupValidation = (): Validation => {
  const validations: Validation[] = []
  for (const fields of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldsValidation(fields))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
