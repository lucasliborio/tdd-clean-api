import { readdirSync } from 'fs'
import { Express, Router } from 'express'
import path from 'path'

const router = Router()

export default (app: Express): void => {
  app.use('/api', router)
  readdirSync(path.resolve(__dirname, '../routes')).filter(x => x.includes('routes') && !x.includes('test') && !x.includes('map')).map(async file => {
    (await import(`../routes/${file}`)).default(router)
  })
}
