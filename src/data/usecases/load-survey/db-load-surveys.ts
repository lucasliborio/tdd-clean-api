import { LoadSurveys, LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[] > {
    const resultSearchSurveys = await this.loadSurveysRepository.loadSurveys()
    return resultSearchSurveys as unknown as SurveyModel[]
  }
}
