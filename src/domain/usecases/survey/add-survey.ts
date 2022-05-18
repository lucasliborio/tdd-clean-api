import { AnswerModel } from '@/domain/models/survey'

export interface AddSurveyParams {
  question: string
  answers: AnswerModel[]
  date: Date
}
export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
