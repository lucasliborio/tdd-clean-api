import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  encrypt (value: string): string {
    const acessToken = jwt.sign({ id: value }, this.secret)
    return acessToken
  }

  decrypt (token: string): string {
    const decode = jwt.verify(token, this.secret)
    return decode as any
  }
}
