// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: ['<rootDir>/test'],

  // Automatically clear mock calls and instances between every test
  // clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],

  // The directory where Jest should output its coverage files
  // coverageDirectory: 'coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'tsx', 'js'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['<rootDir>/enzyme.config.ts'],

  // The test environment that will be used for testing
  // testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/test/**/*.ts?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // testURL: 'http://localhost',

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
  },

  snapshotSerializers: ['enzyme-to-json/serializer'],

  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
