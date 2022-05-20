export const surveyResultSchema = {
  type: 'object',
  description: 'API to send answer to a survey',
  properties: {
    accountId: {
      type: 'string'
    },
    surveyId: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    data: {
      type: 'string'
    },
    id: {
      type: 'string'
    }
  }
}
