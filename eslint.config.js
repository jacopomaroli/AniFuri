/* eslint-disable n/no-unpublished-require */
// const { defineConfig } = require("eslint/config");
// const { pluginImport } = require('eslint-plugin-import')
const pluginN = require('eslint-plugin-n')
const pluginPromise = require('eslint-plugin-promise')
// eslint-disable-next-line n/no-extraneous-require
const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat()

module.exports = [
  ...compat.extends('eslint-config-standard'),
  pluginN.configs['flat/recommended-script'],
  pluginPromise.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      // import: pluginImport
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    rules: {
      'n/exports-style': ['error', 'module.exports']
    }
  }
]
