import { AnswerModel } from '@/domain/models/survey'

export interface AddSurveyModel {
  question: string
  answers: AnswerModel[]
  date: Date
}
export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
