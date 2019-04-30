module.exports = {
  output: './public',
  options: {
    removeUnusedKeys: true,
    defaultLng: 'en',
    lngs: ['en', 'fr'],
    ns: 'translations',
    defaultNs: 'translations',
    trans: {
      fallbackKey: true,
    },
    resource: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
  },
};
