module.exports = {
  // your existing config...
  overrides: [
    {
      files: ['app/generated/prisma/**/*.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // Add other rules you want to disable here
      },
    },
  ],
};
