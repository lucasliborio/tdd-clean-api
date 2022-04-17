export class ServerError extends Error {
  constructor (stack: string) {
    super('Interal Server Error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
