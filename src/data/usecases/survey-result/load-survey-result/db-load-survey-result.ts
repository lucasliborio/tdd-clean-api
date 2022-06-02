import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyByIdRepository } from '../../survey/load-survey-by-id/db-load-survey-by-id-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    let surverResult = await this.loadSurveyResultRepository.loadResultBySurveyId(surveyId)
    if (!surverResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surverResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({}, answer, { count: 0, percent: 0 }))
      }
    }
    return surverResult
  }
}
