import { HttpRequest, HttpResponse } from '../protocols/http'
export interface Controller {
  handle: (req: HttpRequest) => HttpResponse
}
