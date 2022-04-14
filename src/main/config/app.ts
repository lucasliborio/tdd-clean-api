import express from 'express'
import setupMiddlewaes from './middlewares'

const app = express()

setupMiddlewaes(app)

export { app }
