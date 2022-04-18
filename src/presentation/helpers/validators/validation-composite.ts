import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]
  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (inputs: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(inputs)
      if (error) return error
    }
  }
}
