import { AddSurvey, AddSurveyModel } from '@/domain/usecases/add-survey'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly surveyRepository
  ) {}

  async add (data: AddSurveyModel): Promise<void> {
    await this.surveyRepository.addNewSurvey(data)
  }
}
