export const loginParamsSchema = {
  type: 'object',
  description: 'fields to authentication',
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  required: ['email', 'password']
}
