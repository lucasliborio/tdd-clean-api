import { HttpRequest, HttpResponse } from '../protocols/http'
export interface Middleware {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
