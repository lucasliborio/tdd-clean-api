import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

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

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
