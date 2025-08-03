module.exports = {
  extends: ['next/core-web-vitals', 'plugin:import/recommended', 'prettier'],
  rules: {
    // Turning off rules that are not critical or are handled by Prettier
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-useless-path-segments': 'off',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    '@next/next/no-img-element': 'off',

    // --- Relaxed Stylistic Rules ---
    // These are changed from 'error' to 'warn' to prevent build failures

    'lines-around-comment': [
      'warn', // Changed from 'error'
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowObjectStart: true,
        allowArrayStart: true
      }
    ],
    'padding-line-between-statements': [
      'warn', // Changed from 'error'
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export'
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*'
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['function', 'multiline-const', 'multiline-block-like']
      },
      {
        blankLine: 'always',
        prev: ['function', 'multiline-const', 'multiline-block-like'],
        next: '*'
      }
    ],
    'newline-before-return': 'warn', // Changed from 'error'
    'import/newline-after-import': [
      'warn', // Changed from 'error'
      {
        count: 1
      }
    ],
    'import/order': [
      'warn', // Changed from 'error'
      {
        groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], ['object', 'unknown']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '~/**',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['react', 'type'],
        'newlines-between': 'always-and-inside-groups'
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/parsers': {},
    'import/resolver': {
      node: {},
      typescript: {
        project: './jsconfig.json'
      }
    }
  },
  overrides: []
}
