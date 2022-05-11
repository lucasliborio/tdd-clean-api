import express from 'express'
import setupMiddlewaes from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'

const app = express()

setupMiddlewaes(app)
setupRoutes(app)

export default app
