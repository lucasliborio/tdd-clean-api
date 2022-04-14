import supertest from 'supertest'
import { app } from '../config/app'

describe('Json parser middleware', () => {
  test('should parse body as json', async () => {
    app.post('/jsonT', (req, res) => {
      res.json(req.body)
    })

    await supertest(app)
      .post('/jsonT')
      .send({ name: 'Lucas' })
      .expect({ name: 'Lucas' })
  })
})
