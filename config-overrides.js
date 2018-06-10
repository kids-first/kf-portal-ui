const path = require('path');
const fs = require('fs');
const scanner = require('i18next-scanner');
const vfs = require('vinyl-fs');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

const i18nConfig = require('./i18next-scanner.config');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function transpileNodeModules(config) {
  config.module.rules[1].oneOf[1].include = [
    config.module.rules[1].oneOf[1].include,
    resolveApp('node_modules/graphql-fields'),
  ];
  return config;
}

function extractTranslations(config) {
  function TranslationExtract(options) {
    this.chunkVersions = {};
  }

  TranslationExtract.prototype.apply = function(compiler) {
    compiler.plugin('emit', async (compilation, callback) => {
      const files = compilation.chunks
        .filter(chunk => {
          const lastHash = this.chunkVersions[chunk.name];
          this.chunkVersions[chunk.name] = chunk.hash;
          return i18nConfig.options.removeUnusedKeys || chunk.hash !== lastHash;
        })
        .map(chunk => {
          let files = [];
          chunk.forEachModule(module => (files = files.concat(module.fileDependencies || [])));
          return files;
        })
        .reduce((acc, arr) => acc.concat(arr), [])
        .filter(p => p.match(/^(?!.*node_modules.*).*\.js$/));

      if (files.length) {
        vfs
          .src(files)
          .pipe(scanner(i18nConfig.options))
          .pipe(vfs.dest(i18nConfig.output))
          .on('end', () => callback());
      } else {
        callback();
      }
    });
  };

  config.plugins.push(new TranslationExtract({}));

  return config;
}

module.exports = {
  webpack: function(config, env) {
    transpileNodeModules(config);
    extractTranslations(config);
    injectBabelPlugin('emotion', config);
    rewireReactHotLoader(config, env);
    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.watchContentBase = false;
      return config;
    };
  },
};
