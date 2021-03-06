
import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (inputs: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('CompareFieldsValidation', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation failds', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })
  test('Should not return a error ', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate')
    jest.spyOn(validationStubs[1], 'validate')
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
