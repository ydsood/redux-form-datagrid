// Source: https://github.com/facebook/jest/issues/8230
module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': require.resolve('babel-jest'),
  },
};
