export const surveyResultSchema = {
  type: 'object',
  description: 'API to send answer to a survey',
  properties: {
    surveyId: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultSchema'
      }
    },
    data: {
      type: 'string'
    }
  },
  required: ['surveyId', 'question', 'answers']
}
