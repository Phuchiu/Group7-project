module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Suppress specific warnings that are not critical
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    'jsx-a11y/label-has-associated-control': 'off'
  }
};