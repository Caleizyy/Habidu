module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
  moduleNameMapper: {
    '\\.(css|svg|png|jpg)$': '<rootDir>/tests/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        types: ['jest', 'node'],
      },
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx'],
  coverageDirectory: 'coverage',
};
