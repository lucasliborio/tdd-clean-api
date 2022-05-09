export interface AnswerModel {
  image?: string
  answer: string
}
export interface SurveyModel {
  id: string
  question: string
  answers: AnswerModel[]
  date: Date
}
