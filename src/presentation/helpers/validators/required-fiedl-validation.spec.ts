import { MissingParamError } from '../../errors'
import { RequiredFieldsValidation } from './required-field-validation'

const makeFakeBody = {
  name: 'Lucas'
}
describe('', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation('field')
    const error = sut.validate(makeFakeBody)
    expect(error).toEqual(new MissingParamError('field'))
  })
})
