import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async saveSurveyResult (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    const surveyResult = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        data: data.date
      }
    }, {
      upsert: true
    })
    if (surveyResult.value) return MongoHelper.map(surveyResult.value)
    return await MongoHelper.map(await surveyResultCollection.findOne({ _id: surveyResult.lastErrorObject.upserted })) as unknown as SurveyResultModel
  }
}
