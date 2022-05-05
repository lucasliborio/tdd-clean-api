import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-acess-token-repository'
import { LoadAccountByTokenRepository } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token-protocols'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const insertAccount = await accountCollection.insertOne(accountData)
    const resultAccount = await accountCollection.findOne({ _id: insertAccount.insertedId })
    return resultAccount as unknown as AccountModel && MongoHelper.map(resultAccount)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const findOneAccount = await accountCollection.findOne({ email })
    return findOneAccount as unknown as AccountModel && MongoHelper.map(findOneAccount)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { accessToken: token }
      }
    )
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const resultAccount = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return resultAccount as unknown as AccountModel && MongoHelper.map(resultAccount)
  }

  private isAdmin (account: AccountModel): boolean {
    return account.role === 'admin'
  }
}
