export const forbiddenErrorResponse = {
  description: 'forbidden',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
