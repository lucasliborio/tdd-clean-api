import { RequiredFieldsValidation, ValidationComposite } from '../../../../validation/validators'

export const makeSurveyValidation = (): ValidationComposite => {
  const validations = []
  for (const fields of ['question', 'answers']) {
    validations.push(new RequiredFieldsValidation(fields))
  }
  return new ValidationComposite(validations)
}
