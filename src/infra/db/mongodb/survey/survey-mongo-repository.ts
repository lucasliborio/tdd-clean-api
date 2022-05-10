import { AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { LoadSurveysRepository, SurveyModel } from '../../../../data/usecases/load-survey/db-load-surveys-protocols'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async addNewSurvey (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadSurveys (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveysList = surveyCollection.find().toArray()
    return surveysList as unknown as SurveyModel[]
  }
}
