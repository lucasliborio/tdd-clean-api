import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class RequiredFieldsValidation implements Validation {
  private readonly fiedlName: string
  constructor (fiedlName: string) {
    this.fiedlName = fiedlName
  }

  validate (inputs: any): Error {
    if (!inputs[this.fiedlName]) return new MissingParamError(this.fiedlName)
  }
}
