import { badRequest } from './components/bad-request-response'
import { forbiddenErrorResponse } from './components/forbidden-response'
import { notFoundResponse } from './components/not-found-response'
import { serverErrorResponse } from './components/server-error-response'
import { loginPath } from './paths/login-path'
import { surveyPath } from './paths/survey-path'
import { accountSchema } from './schemas/account-schema'
import { answerSchema } from './schemas/answer-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema'
import { surveySchema } from './schemas/survey-schema'
import { surveysSchema } from './schemas/surveys-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Typescript API',
    description: 'API para realizar enquetes entre desenvolvedores'
  },
  servers: [{
    url: '/api'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: ''

  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveyAnswer: answerSchema,
    survey: surveySchema,
    surveys: surveysSchema
  },
  components: {
    badRequest: badRequest,
    serverError: serverErrorResponse,
    forbiddenError: forbiddenErrorResponse,
    notFound: notFoundResponse
  }
}
