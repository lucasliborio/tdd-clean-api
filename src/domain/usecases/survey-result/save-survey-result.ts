import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyParams {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyParams) => Promise<SurveyResultModel>
}
