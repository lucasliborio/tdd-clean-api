
import { SurveyModel } from '@/data/usecases/survey/load-survey/db-load-surveys-protocols'

export interface LoadSurveysRepository {
  loadSurveys: () => Promise<SurveyModel[]>
}
