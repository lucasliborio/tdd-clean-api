module.exports = {
  roots:['<rootDir>/src'],
  preset:'@shelf/jest-mongodb',
  collectCoverageFrom:['<rootDir>/src/**/*.ts'],
  coverageDirectory:'coverage',
  transform:{
    '.+\\.ts$':'ts-jest'
  },
  displayName:'GLOBAL CONFIG'
}
