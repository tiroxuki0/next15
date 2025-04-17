module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    // React
    'react/react-in-jsx-scope': 'off', // React không cần import trong Next.js
    'react/prop-types': 'off', // Sử dụng TypeScript thay vì PropTypes
    'react/display-name': 'off',

    // Next.js
    '@next/next/no-img-element': 'off', // Cho phép sử dụng thẻ img thông thường
    '@next/next/no-html-link-for-pages': 'warn', // Khuyến khích sử dụng Next.js Link

    // TypeScript
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // Import
    'import/no-anonymous-default-export': 'off',

    // Format code
    'lines-around-comment': [
      'error',
      {
        beforeLineComment: true,
        beforeBlockComment: true,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        allowArrayStart: true
      }
    ],
    'newline-before-return': 'error',
    'import/newline-after-import': [
      'error',
      {
        count: 1
      }
    ],

    // Accessibility
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton']
      }
    ],

    // App Router specific rules
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['jsx', 'global']
      }
    ]
  },
  overrides: [
    // Client Components
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      extends: ['eslint:recommended'],
      parser: 'espree', // Sử dụng parser JavaScript tiêu chuẩn
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      rules: {
        'react/no-unknown-property': [
          'error',
          {
            ignore: ['jsx', 'global']
          }
        ]
      }
    },

    // Server Components
    {
      files: ['app/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'react/no-unknown-property': [
          'error',
          {
            ignore: ['jsx', 'global']
          }
        ]
      }
    },

    // TypeScript definition files
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },

    // Test files
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
