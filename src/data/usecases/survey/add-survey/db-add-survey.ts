import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly surveyRepository
  ) {}

  async add (data: AddSurveyParams): Promise<void> {
    await this.surveyRepository.addNewSurvey(data)
  }
}
