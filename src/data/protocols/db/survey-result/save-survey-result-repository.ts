import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  saveSurveyResult: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
