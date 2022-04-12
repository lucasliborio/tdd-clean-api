const config = require('./jest.config')

config.displayName = 'Integration test',
config.testMatch = ["<rootDir>/src/**/*.test.ts"]

module.exports = config