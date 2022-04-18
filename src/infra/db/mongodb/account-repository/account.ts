import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const insertAccount = await accountCollection.insertOne(accountData)
    const resultAccount = await accountCollection.findOne({ _id: insertAccount.insertedId })
    const { _id, ...accountWithoutId } = resultAccount
    const account = { ...Object.assign({}, accountWithoutId, { id: _id }) }
    return account as unknown as AccountModel
  }
}
