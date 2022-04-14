import supertest from 'supertest'
import { app } from '../config/app'

describe('SignUp Router', () => {
  test('should return an account on sucess', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({
        name: 'Lucas',
        email: 'lucas@gmail.com',
        password: 'valid',
        passwordConfirmation: 'valid'
      })
      .expect(200)
  })
})
