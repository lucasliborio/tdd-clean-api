
import { SurveyModel } from '@/data/usecases/load-survey/db-load-surveys-protocols'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel>
}
