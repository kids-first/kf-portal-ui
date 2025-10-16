import { defineConfig } from 'cypress';

import { getDateTime } from './cypress/support/utils';

const { strDate, strTime } = getDateTime();

const getName = (url = '', parallel = '') => {
    if (url.includes('netlify')) {
      return (
        url.replace('https://', '').split('.')[0].split('-')[2]+'/'+parallel
      );
    } else {
      return 'QA/'+parallel;
    }
};

export default defineConfig({
  projectId: '8q77r5',
  chromeWebSecurity: true,
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config);
    },
    baseUrl: 'https://portal-qa.kidsfirstdrc.org',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    slowTestThreshold: 60000,
    downloadsFolder: `cypress/downloads/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    screenshotsFolder: `cypress/screenshots/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    videosFolder: `cypress/videos/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    experimentalPromptCommand: true,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile:
      'cypress/results/' +
      `${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}/` +
      strDate +
      '_' +
      strTime +
      '-[hash].xml',
    rootSuiteTitle: 'Tests Cypress',
  },
});
