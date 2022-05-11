import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
export interface Controller {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
