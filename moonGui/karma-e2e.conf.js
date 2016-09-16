// Karma configuration for e2e tests
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/e2e/**/*.js'],
  framework: 'jasmine'
};