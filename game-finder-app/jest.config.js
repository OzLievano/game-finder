module.exports = {
  preset: "ts-jest", // Use ts-jest for TypeScript
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest to handle imports for JavaScript/TypeScript files
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Make sure your setup file is referenced
  testEnvironment: "jsdom", // For React testing
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy", // Mock CSS imports
  }, // Ensure Jest knows to handle .ts and .tsx files
};
