
import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('CompareFieldsValidation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value1' })
    expect(error).toEqual(new InvalidParamError('field'))
  })
  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'valid_value', fieldToCompare: 'valid_value' })
    expect(error).toBeFalsy() // CAPTURA SE FOR void
  })
})
