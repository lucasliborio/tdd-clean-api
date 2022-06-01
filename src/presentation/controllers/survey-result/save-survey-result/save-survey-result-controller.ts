import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../survey/load-survey/load-survey-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = req.params.surveyId
      const answer = req.body.answer
      const accountId = req.accountId
      const surveyValidation = await this.loadSurveyById.load(surveyId)
      if (surveyValidation) {
        const answers = surveyValidation.answers.map(a => a.answer)
        if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
        else {
          const saveSurveyResult = await this.saveSurveyResult.save({ surveyId, accountId, answer, date: new Date() })
          if (saveSurveyResult) return ok(saveSurveyResult)
        }
      } else {
        return forbidden(new InvalidParamError('survey_id'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
