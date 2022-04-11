module.exports = {
  roots:['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom:['<rootDir>/src/**/*.spec.ts'],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment:"node",
  transform:{
    '.+\\.ts$': 'ts-jest'
  }
};
