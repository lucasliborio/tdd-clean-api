import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyParams = Omit<SurveyResultModel, 'id'>
export interface SaveSurveyResult {
  save: (data: SaveSurveyParams) => Promise<SurveyResultModel>
}
