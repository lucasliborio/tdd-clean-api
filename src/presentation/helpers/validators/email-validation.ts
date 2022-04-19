import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly fiedlName: string
  private readonly emailValidator: EmailValidator
  constructor (fiedlName: string, emailValidator: EmailValidator) {
    this.fiedlName = fiedlName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fiedlName])
    if (!isValid) {
      return new InvalidParamError(this.fiedlName)
    }
  }
}
