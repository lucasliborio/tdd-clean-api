import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    /* return new Promise((resolve, reject) => {
      jwt.sign(value, 'valid_secret', (err, decoded) => {
        if (err) return reject(err)
        resolve(decoded)
      })
    }) */
    await jwt.sign({ id: value }, this.secret)
    return null
  }
}
