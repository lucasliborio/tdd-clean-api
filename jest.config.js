module.exports = {
  roots:['<rootDir>/src'],
  preset:'@shelf/jest-mongodb',
  collectCoverageFrom:[
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory:'coverage',
  transform:{
    '.+\\.ts$':'ts-jest'
  },
  displayName:'GLOBAL CONFIG'
}
