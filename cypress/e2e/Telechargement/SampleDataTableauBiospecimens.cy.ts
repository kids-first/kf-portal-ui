/// <reference types="cypress"/>
import '../../support/commands';
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitDataExploration('biospecimens', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
  cy.sortTableAndIntercept('Study', 1);
  cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
  cy.clickAndIntercept('[class*="Header_ProTableHeader"] button[class*="ant-btn-default"]', 'POST', '**/biospecimen-data', 1, false/*beVisible*/, 1);
  cy.waitUntilFile(oneMinute);
});

describe('Page Data Exploration (Biospecimens) - Télécharger le sample data', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName(`kf_biospecimenData_${strDate.slice(0, 4)}${strDate.slice(4, 6)}${strDate.slice(6, 8)}T*.xlsx`);
  });

  it('Valider le contenu du fichier', () => {
    cy.validateXlsxFileContent('DownloadSampleData.json');
  });
});
