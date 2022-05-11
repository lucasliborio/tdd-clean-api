
import { AuthMiddleware } from '@/presentation/middleware/auth-middleware'
import { Middleware } from '@/presentation/protocols'
import { makeLoadAccountByTokenUsecase } from '@/main/factories/usecases/load-account-by-token/db-load-account-by-token'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByTokenUsecase(), role)
}
