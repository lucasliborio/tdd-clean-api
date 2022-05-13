import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/usecases/survey/add-survey/db-add-survey-protocols'
import { LoadSurveysRepository, SurveyModel } from '../../../../data/usecases/survey/load-survey/db-load-surveys-protocols'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    const newId = new ObjectId(id)
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveyResult = await surveyCollection.findOne({ _id: newId })
    return surveyResult as unknown as SurveyModel
  }

  async addNewSurvey (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadSurveys (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveysList = await surveyCollection.find().toArray()
    return surveysList.map(c => MongoHelper.map(c)) as unknown as SurveyModel[]
  }
}
