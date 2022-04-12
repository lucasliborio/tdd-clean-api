const config = require('./jest.config')
config.testMatch = ['<rootDir>/src/**/*.spec.ts']
config.displayName = 'Unit Test'
config.collectCoverage = false

module.exports = config