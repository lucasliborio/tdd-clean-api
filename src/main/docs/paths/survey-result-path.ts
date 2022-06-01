export const surveyResultPath = {
  put: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'API TO SEND RESULT FOR A SURVEY',
    parameters: [
      {
        name: 'surveyId',
        in: 'path',
        description: 'ID of survey',
        required: true,
        type: 'string'
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams'
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultResponseSchema'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbiddenError'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'API TO LOAD A SURVEY RESULT',
    parameters: [
      {
        name: 'surveyId',
        in: 'path',
        description: 'ID of survey',
        required: true,
        type: 'string'
      }
    ],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultResponseSchema'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbiddenError'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
