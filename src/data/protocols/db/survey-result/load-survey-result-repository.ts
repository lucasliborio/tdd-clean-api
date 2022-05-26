import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadResultBySurveyId: (surveyId: string) => Promise<SurveyResultModel>
}
