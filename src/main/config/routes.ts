import { readdirSync } from 'fs'
import path from 'path'
import { Express, Router } from 'express'

const router = Router()

export default (app: Express): void => {
  app.use('/api', router)
  readdirSync(path.resolve(__dirname, '../routes')).filter(x => x.includes('routes') && !x.includes('test')).map(async file => {
    (await import(`../routes/${file}`)).default(router)
  })
}
