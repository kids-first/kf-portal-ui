const path = require('path');

module.exports = (config, env) => {
  config.module.rules = [
    ...config.module.rules,
    { test: /\.(gif|svg|jpg|png)$/, loader: 'file-loader' },
  ];
  return config;
};
