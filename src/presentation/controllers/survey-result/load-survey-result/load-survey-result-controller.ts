import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../survey/load-survey/load-survey-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = req.params.surveyId
      const surveyById = await this.loadSurveyById.load(surveyId)
      if (!surveyById) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const loadSurveyResult = await this.loadSurveyResult.load(surveyId)
      return ok(loadSurveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
