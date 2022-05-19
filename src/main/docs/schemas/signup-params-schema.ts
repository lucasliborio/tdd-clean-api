export const signUpParamsSchema = {
  type: 'object',
  description: 'registration fields',
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    passwordConfirmation: {
      type: 'string'
    }
  },
  required: ['name', 'email', 'password', 'passwordConfirmation']
}
