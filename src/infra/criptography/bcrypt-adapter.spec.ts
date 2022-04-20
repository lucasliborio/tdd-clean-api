import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('valid_hash'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  test('Should call bcrypt  with correct values', async () => {
    const sut = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('valid_hash')
    expect(await bcrypt.hash('aloha', 2)).toBe('valid_hash')
  })

  test('Should throws if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
