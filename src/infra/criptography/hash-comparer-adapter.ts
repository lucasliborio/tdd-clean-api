import { HashComparer } from '../../data/protocols/criptography/hash-comparer'
import bcrypt from 'bcrypt'

export class HashComparerAdapter implements HashComparer {
  async compare (password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword)
  }
}
