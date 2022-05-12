import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async load (id: string): Promise<SurveyModel> {
    const surveyById = this.loadSurveyByIdRepository.loadById(id)
    return surveyById
  }
}
