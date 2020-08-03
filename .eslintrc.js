module.exports = {
  'env': {
    'browser': false,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    // 'standard',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
  },
};
