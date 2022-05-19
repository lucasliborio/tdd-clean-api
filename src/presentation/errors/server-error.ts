export class ServerError extends Error {
  constructor (stack: string) {
    super('interal server error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
