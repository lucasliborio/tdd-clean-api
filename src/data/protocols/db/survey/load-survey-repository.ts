
import { SurveyModel } from '@/data/usecases/load-survey/db-load-surveys-protocols'

export interface LoadSurveysRepository {
  loadSurveys: () => Promise<SurveyModel[]>
}
