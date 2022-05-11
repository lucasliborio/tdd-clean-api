import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
export interface Middleware {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
