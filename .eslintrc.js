module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:jsx-a11y/recommended',
    'next',
    'next/core-web-vitals',
    'prettier'
  ],
  settings: {
    jsdoc: {
      mode: 'typescript',
      tagNamePreference: {
        returns: 'return'
      }
    }
  },
  plugins: ['prettier', 'jsdoc'],
  rules: {
    'jsdoc/check-indentation': 'warn',
    'jsdoc/check-line-alignment': [
      'warn',
      'always',
      {
        tags: [
          'param',
          'return',
          'property',
          'type',
          'default',
          'name',
          'description'
        ]
      }
    ],
    'jsdoc/require-param': [
      'warn',
      {
        checkRestProperty: true,
        unnamedRootBase: ['props']
      }
    ],
    'no-unused-vars': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': ['error', {allow: ['warn', 'error']}],
    'prettier/prettier': 'error'
  }
}
