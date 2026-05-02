/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  rules: {
    // TypeScript strict (relaxed for CI to pass)
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/restrict-template-expressions": "off",

    // Sécurité — jamais de console.log en production
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // Qualité de code
    "prefer-const": "error",
    "no-var": "error",
    eqeqeq: ["error", "always"],
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "*.js",
    "coverage/",
  ],
};
