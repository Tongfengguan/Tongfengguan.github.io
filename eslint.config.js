import vue from 'eslint-plugin-vue'
import typescript from '@vue/eslint-config-typescript'
import prettier from '@vue/eslint-config-prettier'

export default [
  ...typescript(),
  ...vue.configs['flat/recommended'],
  prettier(),
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      'docs/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'env.d.ts',
    ],
  },
]
