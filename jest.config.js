module.exports = {
  roots:['<rootDir>/src'],
  preset:'@shelf/jest/mongodb',
  collectCoverage: true,
  collectCoverageFrom:['<rootDir>/src/**/*.ts'],
  coverageDirectory:'coverage',
  testEnvironment:'node',
  transform:{
    '.+\\.ts$':'ts-jest'
  },
  displayName:'DEFAULT CONFIG'
}
