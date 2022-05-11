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
  moduleNameMapper:{
    '@/(.*)':'<rootDir>/src/$1'
  },
  displayName:'GLOBAL CONFIG'
}
