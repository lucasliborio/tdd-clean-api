
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-survey-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const listSurveys = await this.loadSurveys.load()
      return listSurveys.length ? ok(listSurveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
