import { readdirSync } from 'fs'
import path from 'path'
import { Express, Router } from 'express'

const router = Router()

export default (app: Express): void => {
  app.use('/api', router)
  readdirSync(path.resolve('src/main/routes')).filter(x => x.includes('routes') && !x.includes('test')).map(async file => {
    await import(`../routes/${file}`).then(modulo => modulo.default(router))
  })
}
