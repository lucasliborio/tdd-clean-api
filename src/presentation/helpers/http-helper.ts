import { HttpResponse } from '../protocols/http'

export function badRequest (err: Error): HttpResponse {
  return {
    statusCode: 400,
    body: err
  }
}
