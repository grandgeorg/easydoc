const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'www/assets/js'),
  },
  mode: 'production'
};