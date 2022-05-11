import { adaptMiddleware } from '@/main/adapters/middlewares/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))