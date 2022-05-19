export class EmailInUseError extends Error {
  constructor () {
    super('received email is already in use')
    this.name = 'InvalidParamError'
  }
}
