import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class RequiredFieldsValidation implements Validation {
  private readonly fiedlName: string
  constructor (fiedlName: string) {
    this.fiedlName = fiedlName
  }

  validate (inputs: any): Error {
    if (!inputs[this.fiedlName]) return new MissingParamError(this.fiedlName)
  }
}
