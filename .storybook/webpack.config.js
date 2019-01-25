const path = require('path');

module.exports = (config, env) => {
  config.module.rules = [
    ...config.module.rules,
    { test: /\.(gif|svg|jpg|png)$/, loader: 'file-loader' },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ];
  return config;
};
