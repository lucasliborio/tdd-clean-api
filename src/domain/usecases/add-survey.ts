
interface AnswerModel {
  image: string
  answer: string
}
export interface AddSurveyModel {
  question: string
  answers: AnswerModel[]
}
export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
