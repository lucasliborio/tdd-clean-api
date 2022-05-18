import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  addNewSurvey: (surveyData: AddSurveyParams) => Promise<void>
}
