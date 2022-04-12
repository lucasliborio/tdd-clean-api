import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export function badRequest (err: Error): HttpResponse {
  return {
    statusCode: 400,
    body: err
  }
}

export function serverError (): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}