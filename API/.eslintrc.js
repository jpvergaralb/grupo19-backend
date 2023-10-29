module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    "no-console": "off",
    "camelcase": "off",
    "no-nested-ternary": "off",
    "consistent-return": "off",
    "eqeqeq": "off",
    "arrow-body-style": "off",
  },
};
