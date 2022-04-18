import { ServerError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../protocols'

export function badRequest (err: Error): HttpResponse {
  return {
    statusCode: 400,
    body: { error: err.message }
  }
}
export function unauthorized (): HttpResponse {
  return {
    statusCode: 401,
    body: new UnauthorizedError().message
  }
}

export function serverError (err: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(err.stack).name
  }
}

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
