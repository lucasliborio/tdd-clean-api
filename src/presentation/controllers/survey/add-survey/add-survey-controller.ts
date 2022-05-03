import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(req)
    return null
  }
}
