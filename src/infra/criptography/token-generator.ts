import { TokenGenerator } from '../../data/protocols/criptography/token-generator'
import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter implements TokenGenerator {
  async generate (id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(id, 'dfsdhfoisdhfodshfjoisdfsf', (err, decoded) => {
        if (err) return reject(err)
        resolve(decoded)
      })
    })
  }
}
