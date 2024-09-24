module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios|react-router-dom|other-package-to-transform)/)",
  ],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
