module.exports = {
  roots: ['<rootDir>/src/presentation'],
  projects: [
    {
      displayName: 'Unit Test',
      transform: {
        '.+\\.ts$': 'ts-jest'
      },
      testMatch:["<rootDir>/**/**/*.spec.ts"],
      collectCoverage: true,
      collectCoverageFrom: ['<rootDir>/src/**/*.spec.ts'],
      coverageDirectory: "coverage",
      coverageProvider: "v8",
      testEnvironment: "node",
    }
  ],
};
