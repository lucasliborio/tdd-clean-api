import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  private readonly fiedlName: string
  private readonly fieldToCompareName: string
  constructor (fiedlName: string, fieldToCompareName: string) {
    this.fiedlName = fiedlName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (inputs: any): Error {
    if (inputs[this.fiedlName] !== inputs[this.fieldToCompareName]) return new InvalidParamError(this.fiedlName)
  }
}
