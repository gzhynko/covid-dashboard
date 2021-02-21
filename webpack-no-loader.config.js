const path = require('path');

module.exports = {
  entry: {
    main: "./dist/main.js",
  },
  output: {
    path: path.join(__dirname, 'docs'),
    filename: '[name]-bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './web',
      }
    ]),
  ],
};