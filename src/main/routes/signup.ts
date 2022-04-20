/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapters'
import { makeSignupController } from '../factories/signup/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
}
