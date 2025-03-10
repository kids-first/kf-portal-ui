/// <reference types="cypress"/>
import '../../support/commands';
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
  cy.get('[class*="Header_ProTableHeader"] button[class*="ant-dropdown-trigger"]').eq(1).click({force: true});
  cy.clickAndIntercept('[data-menu-id*="-familyClinicalData"]', 'POST', '**/family-clinical-data', 1);
  cy.waitUntilFile(oneMinute);
});

describe('Page Data Exploration (Participants) - Télécharger le clinical data (family)', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName(`kf_familyClinicalData_${strDate.slice(0, 4)}${strDate.slice(4, 6)}${strDate.slice(6, 8)}T*.xlsx`);
  });

  it('Valider le contenu du fichier [SKFP-1277]', () => {
    cy.validateXlsxFileContent('DownloadClinicalDataFamily.json');
  });
});
