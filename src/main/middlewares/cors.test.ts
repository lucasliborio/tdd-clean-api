import supertest from 'supertest'
import app from '@/main/config/app'

describe('CORS Middleware', () => {
  test('should parse body as json', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })

    await supertest(app)
      .get('/test-cors')
      .expect('acess-control-allow-origin', '*')
      .expect('acess-control-allow-headers', '*')
      .expect('acess-control-allow-methods', '*')
  })
})
