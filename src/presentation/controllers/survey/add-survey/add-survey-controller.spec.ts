import { HttpRequest, Controller, Validation, AddSurvey, AddSurveyModel } from './add-survey-protocols'
import { badRequest } from '../../../helpers/http/http-helper'
import { AddSurveyController } from './add-survey-controller'
describe('Add Survey Controller', () => {
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
      async add (account: AddSurveyModel): Promise<void> {
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
      }]
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
  /* test('should throws if validation throws', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toThrowError(new Error())
  }) */

  test('should return 204 if succeds', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(validationStub, 'validate')
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
  })
})
