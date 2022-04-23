import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-acess-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
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
        // eslint-disable-next-line quote-props
        $set: { accessToken: token }
      }
    )
  }
}