import { badRequest } from './components/bad-request-response'
import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema'

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
    '/login': loginPath
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: ''

  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest: badRequest
  }
}
