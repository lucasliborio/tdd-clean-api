module.exports = {
  roots:['<rootDir>/src'],
  preset:'@shelf/jest-mongodb',
  collectCoverageFrom:[
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!<rootDir>/src/**/*index.ts'
    
  ],
  coverageDirectory:'coverage',
  transform:{
    '.+\\.ts$':'ts-jest'
  },
  displayName:'GLOBAL CONFIG'
}
