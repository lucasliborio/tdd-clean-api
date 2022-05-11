import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldsValidation, EmailValidation, ValidationComposite } from '@/validation/validators'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []
  for (const fields of ['email', 'password']) {
    validations.push(new RequiredFieldsValidation(fields))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
