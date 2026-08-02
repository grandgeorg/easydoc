const path = require('path');

module.exports = {
  entry: {
    'app.min': './src/js/app.js',
    'dashboard.min': './src/js/dashboard.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'www/assets/js'),
  },
  mode: 'production'
};