import { AddSurveyModel } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  addNewSurvey: (surveyData: AddSurveyModel) => Promise<void>
}
