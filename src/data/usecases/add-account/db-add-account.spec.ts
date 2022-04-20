import { AddAccountModel, Hasher, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

export interface SubType {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}
const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  return new HasherStub()
}
const makeSut = (): SubType => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepo()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}
const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
}
const makeAccountData = (): AddAccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_name@mail.com',
    password: 'valid_password'
  }
}
const makeAddAccountRepo = (): AddAccountRepository => {
  class AddAccountRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepository()
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptspy = jest.spyOn(hasherStub, 'encrypt')
    await sut.add(makeAccountData())
    expect(encryptspy).toHaveBeenCalledWith('valid_password')
  })

  test('Should thorw if Encrypet throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeAccountData())
    await expect(addSpy).toHaveBeenCalledWith(
      {
        name: 'valid_name',
        email: 'valid_name@mail.com',
        password: 'hashed_value'
      }
    )
  })

  test('Should thorw if AddAccount throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on sucess', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
