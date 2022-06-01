import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../survey/load-survey/load-survey-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const surveyId = req.params.surveyId
    const surveyById = await this.loadSurveyById.load(surveyId)
    if (!surveyById) return forbidden(new InvalidParamError('surveyId'))
  }
}
