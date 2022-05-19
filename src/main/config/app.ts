import express from 'express'
import setupMiddlewaes from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupDocs from '../config/config-swagger'
const app = express()
setupDocs(app)
setupMiddlewaes(app)
setupRoutes(app)

export default app
