import { DbAuthentication } from './db-authentication'
import { AccountModel, Authentication, AuthenticationModel, HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

interface SutTypes {
  sut: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateTokenAccessRepositoryStub: UpdateAccessTokenRepository
}

const makeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
}

const makeFakeAuthenticationModel = (): AuthenticationModel => {
  return {
    email: 'valid_email',
    password: 'valid_password'
  }
}

const makeHashCompare = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hashPassword: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt (id: string): string {
      return 'valid_token'
    }
  }
  return new EncrypterStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeUpdateTokenAccessRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (email: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashCompare()
  const encrypterStub = makeEncrypter()
  const updateTokenAccessRepositoryStub = makeUpdateTokenAccessRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateTokenAccessRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateTokenAccessRepositoryStub
  }
}

describe('', () => {
  test('Should call LoadAccountByEmailrepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthenticationModel())
    expect(loadSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if LoadAccountByEmailRepository Thorws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if no Account is found on loadAccountByEmailRepository', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBe(null)
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith('valid_password', 'hashed_password')
  })

  test('Should return null if hashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const sutSpy = await sut.auth(makeFakeAuthenticationModel())
    expect(sutSpy).toBe(null)
  })
  test('Should throws if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const sutSpy = sut.auth(makeFakeAuthenticationModel())
    await expect(sutSpy).rejects.toEqual(new Error())
  })

  test('Should call TokenGenerator with correct ID', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())
    expect(encryptSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should throws if TokenGenerator throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const sutSpy = sut.auth(makeFakeAuthenticationModel())
    await expect(sutSpy).rejects.toThrow()
  })

  test('Should call UpdateAcesstokenRepository with correct vallues', async () => {
    const { sut, updateTokenAccessRepositoryStub, encrypterStub } = makeSut()
    const updateSpy = jest.spyOn(updateTokenAccessRepositoryStub, 'updateAccessToken')
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValue('valid_token')
    await sut.auth(makeFakeAuthenticationModel())
    expect(updateSpy).toBeCalledWith('valid_id', 'valid_token')
  })

  test('Should throws if updateAccessTokenRepository throws', async () => {
    const { sut, updateTokenAccessRepositoryStub } = makeSut()
    jest.spyOn(updateTokenAccessRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const sutSpy = sut.auth(makeFakeAuthenticationModel())
    await expect(sutSpy).rejects.toEqual(new Error())
  })
})
