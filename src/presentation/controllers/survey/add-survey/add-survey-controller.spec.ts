import { HttpRequest, Controller, Validation } from './add-survey-protocols'
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
  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      asnswers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  })
  interface SutTypes {
    sut: Controller
    validationStub: Validation
  }
  const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    return {
      sut,
      validationStub
    }
  }
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validationSpy).toBeCalledWith(makeFakeRequest())
  })
})
