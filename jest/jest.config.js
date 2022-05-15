module.exports = {
  rootDir: '../',
  clearMocks: true,
  errorOnDeprecated: true,
  testMatch: ['<rootDir>/**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/coverage/'],
  transformIgnorePatterns: ['node_modules/(?!(@alesmenzel/event-emitter)/)'],
};
