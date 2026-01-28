const nextConfig = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...nextConfig,
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  }
];
