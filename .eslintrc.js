module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  plugins: ["prettier"],
  rules: {
    "@typescript-eslint/func-call-spacing": "error",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/semi": "error",
    "max-len": ["error", {
      "code": 120
    }],
    "prefer-const": "error",
    "prettier/prettier": "error",
    "sort-keys": "error",
  }
};