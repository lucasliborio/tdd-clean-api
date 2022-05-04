
import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const inputsValidation = this.validation.validate(req.body)
      if (inputsValidation) {
        return badRequest(inputsValidation)
      }
      const { question, answers } = req.body
      await this.addSurvey.add({ question, answers })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
