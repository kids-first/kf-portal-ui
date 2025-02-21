/// <reference types="cypress"/>
import '../../support/commands';
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitParticipantEntity('PT_01236T3G');
  cy.get('[class*="EntityTitle"] button[class*="ant-dropdown-trigger"]').click({force: true});
  cy.clickAndIntercept('[data-menu-id*="-familyClinicalData"]', 'POST', '**/family-clinical-data', 1);
  cy.waitUntilFile(oneMinute);
});

describe('Page d\'un participant - Télécharger le clinical data (family)', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName(`kf_familyClinicalData_${strDate.slice(0, 4)}${strDate.slice(4, 6)}${strDate.slice(6, 8)}T*.xlsx`);
  });

  it('Valider le contenu du fichier [SKFP-1277]', () => {
    cy.validateXlsxFileContent('DownloadClinicalDataFamily.json');
  });
});
