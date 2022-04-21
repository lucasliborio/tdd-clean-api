import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  encrypt (value: string): string {
    const acessToken = jwt.sign({ id: value }, this.secret)
    return acessToken
  }
}
