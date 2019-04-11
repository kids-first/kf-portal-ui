const scanner = require('i18next-scanner');
const vfs = require('vinyl-fs');

const i18nConfig = require('./i18next-scanner.config');

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
