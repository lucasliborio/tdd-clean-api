
import { SurveyModel } from '@/data/usecases/survey/load-survey/db-load-surveys-protocols'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel>
}
