const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const { injectBabelPlugin } = require('react-app-rewired');

function rewireEmotion(config, env) {
  config.module.rules[1].oneOf[1].include = [
    config.module.rules[1].oneOf[1].include,
    resolveApp('node_modules/graphql-fields'),
  ];

  return injectBabelPlugin('emotion', config);
}

module.exports = rewireEmotion;
