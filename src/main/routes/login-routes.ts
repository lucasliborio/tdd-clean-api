/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapters'
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory'
import { makeSignupController } from '@/main/factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
