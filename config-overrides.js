const { injectBabelPlugin } = require('react-app-rewired');

function rewireEmotion(config) {
  return injectBabelPlugin('emotion', config);
}

module.exports = rewireEmotion;
