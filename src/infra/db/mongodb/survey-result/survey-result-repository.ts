import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyParams } from '@/domain/usecases/survey-result/save-survey-result'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async saveSurveyResult (data: SaveSurveyParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        data: data.date
      }
    }, {
      upsert: true
    })
    return this.loadResultBySurveyId(data.surveyId)
  }

  async loadResultBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    const resultsBySurveyId = await surveyResultCollection.find({
      surveyId: new ObjectId(surveyId)
    }).toArray()

    if (!resultsBySurveyId.length) return null
    return await this.createSurveyResult(resultsBySurveyId)
  }

  async createSurveyResult (results: any): Promise<SurveyResultModel> {
    const allCount = results.length
    const survey = await (await MongoHelper.getCollection('surveys')).findOne({ _id: new ObjectId(results[0].surveyId) })
    const surveysAnswers = survey.answers.map(x => Object.assign(x, { count: 0, percent: 0 }))
    results.forEach(result => { surveysAnswers.map(answers => result.answer === answers.answer ? answers.count++ : false) })
    surveysAnswers.forEach(answer => answer.percent = Math.round((answer.count / allCount) * 100))
    return {
      surveyId: survey._id.toString(),
      question: survey.question,
      answers: surveysAnswers,
      date: survey.date

    }
  }

  /* async loadResultBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                },
                isCurrentAccountAnswerCount: {
                  $cond: [{
                    $eq: ['$$item.answer', {
                      $arrayElemAt: ['$currentAccountAnswer', 0]
                    }]
                  }, 1, 0]
                }
              }]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        },
        isCurrentAccountAnswerCount: {
          $sum: '$answers.isCurrentAccountAnswerCount'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent',
          isCurrentAccountAnswer: {
            $eq: ['$isCurrentAccountAnswerCount', 1]
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: {
          $toString: '$_id.surveyId'
        },
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const surveyResult = await surveyResultCollection.aggregate<SurveyResultModel>(query).toArray()
    return surveyResult.length ? surveyResult[0] : null
  } */
}
