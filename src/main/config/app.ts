import express from 'express'
import setupMiddlewaes from './middlewares'
import setupRoutes from './routes'

const app = express()

setupMiddlewaes(app)
setupRoutes(app)

export default app
