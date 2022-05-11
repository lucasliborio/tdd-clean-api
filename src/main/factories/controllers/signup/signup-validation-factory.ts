import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/protocols/validation'
import {
  RequiredFieldsValidation,
  EmailValidation,
  CompareFieldsValidation,
  ValidationComposite
} from '@/validation/validators'

export const makeSignupValidation = (): Validation => {
  const validations: Validation[] = []
  for (const fields of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldsValidation(fields))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
