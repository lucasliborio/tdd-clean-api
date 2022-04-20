import { Encrypter } from '../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(value, 'dfsdhfoisdhfodshfjoisdfsf', (err, decoded) => {
        if (err) return reject(err)
        resolve(decoded)
      })
    })
  }
}
