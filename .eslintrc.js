module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  //   overrides: [
  //     {
  //       env: {
  //         node: true,
  //       },
  //       files: [".eslintrc.{js,cjs}"],
  //       parserOptions: {
  //         sourceType: "script",
  //       },
  //     },
  //   ],xa
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": "off", // Disabling the no-unused-vars rule
    // You can add custom rules here if needed
  },
};
