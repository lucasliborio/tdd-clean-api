import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

import env from './env'

void MongoHelper.connect(process.env.MONGO_URL || env.MongoUrl).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.port, () => {
    console.log('server is running on 3000')
  })
})
