module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/prettier',
    'vue-global-api',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'vue/require-v-for-key': 'off',
  },
}
