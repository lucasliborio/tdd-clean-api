import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'

import { Controller, HttpRequest, HttpResponse } from '../survey/load-survey/load-survey-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyValidation = await this.loadSurveyById.load(req.params.survey_id)
      if (!surveyValidation) return forbidden(new InvalidParamError('survey_id'))
    } catch (error) {
      return serverError(error)
    }
  }
}
