import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyParams } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  saveSurveyResult: (data: SaveSurveyParams) => Promise<SurveyResultModel>
}
