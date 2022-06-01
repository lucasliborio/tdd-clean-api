import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller, HttpRequest, HttpResponse } from '../../survey/load-survey/load-survey-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const surveyId = req.params.surveyId
    await this.loadSurveyById.load(surveyId)
    return Promise.resolve(null)
  }
}
