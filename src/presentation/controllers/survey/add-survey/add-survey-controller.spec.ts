import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Controller, Validation, AddSurvey, AddSurveyParams } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import MockDate from 'mockdate'

describe('Add Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
      validate (inputs: any): Error {
        return null
      }
    }
    return new ValidationStub()
  }
  const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
      async add (account: AddSurveyParams): Promise<void> {
        return null
      }
    }
    return new AddSurveyStub()
  }
  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  })
  interface SutTypes {
    sut: Controller
    validationStub: Validation
    addSurveyStub: AddSurvey
  }
  const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const addSurveyStub = makeAddSurveyStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
      sut,
      validationStub,
      addSurveyStub
    }
  }
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validationSpy).toBeCalledWith(makeFakeRequest().body)
  })
  test('should return a error if validation return a error', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('should call AddSurvey.add with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const addSurvey = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(httpRequest)
    expect(addSurvey).toBeCalledWith(makeFakeRequest().body)
  })
  test('should throws if AddSurvey.add throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 if succeds', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(validationStub, 'validate')
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
  })
})
