module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "^.+\\.module\\.(css|sass|scss)$": "<rootDir>/.jest/identity-obj-proxy-esm.js"
  },
  collectCoverageFrom: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  coverageReporters: [
    "json",
    "lcov",
    "text-summary",
    "json-summary"
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 5,
      lines: 15,
      statements: 15
    }
  }
};
