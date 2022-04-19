import { TokenGenerator } from '../../data/protocols/criptography/token-generator'
import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter implements TokenGenerator {
  async generate (id: string): Promise<string> {
    const validToken = await jwt.sign(id)
  }
}