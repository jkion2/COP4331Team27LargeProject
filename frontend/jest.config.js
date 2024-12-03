module.exports = {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  testEnvironment: 'jsdom', // Required for React testing
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Use babel-jest to process .js, .jsx, .ts, and .tsx files
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map the @ alias to the src directory
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy', // Mock CSS imports
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Add setup file for Jest
};
