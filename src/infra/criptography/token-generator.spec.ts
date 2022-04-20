import { TokenGenerator } from '../../data/protocols/criptography/token-generator'
import { TokenGeneratorAdapter } from './token-generator'
import jwt from 'jsonwebtoken'

const makeSut = (): TokenGenerator => {
  return new TokenGeneratorAdapter()
}
describe('Token Generator adapter', () => {
  jest.mock('jwt')
  test('Should call token generator adpter with correc values', async () => {
    const sut = makeSut()
    const token = 
    await expect(jwtSpy).resolves.toEqual('valid_jwt')
  })
})
