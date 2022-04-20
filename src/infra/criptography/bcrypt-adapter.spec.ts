import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('valid_hash'))
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  test('Should call hash  with correct values', async () => {
    const sut = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('valid_hash')
    expect(await bcrypt.hash('aloha', 2)).toBe('valid_hash')
  })

  test('Should throws if bcrypt.hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare  with correct values', async () => {
    const sut = makeSut()
    const compareBcryptSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')

    expect(compareBcryptSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true if bcrypt compare return true', async () => {
    const sut = makeSut()
    const resultSut = await sut.compare('any_value', 'any_hash')
    expect(resultSut).toBe(true)
  })

  test('Should return false if bcrypt compare return false', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const resultSut = await sut.compare('any_value', 'any_hash')
    expect(resultSut).toBe(false)
  })
})
