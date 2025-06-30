/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  roots: ["<rootDir>/src"],

  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: ["**/__tests__/**/*.(spec|test).ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFiles: ["dotenv/config"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  clearMocks: true,
  restoreMocks: true,

  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
