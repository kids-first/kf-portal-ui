/// <reference types="cypress"/>
import '../../support/commands';
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitDataExploration('datafiles', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.sortTableAndIntercept('Format', 1);
  cy.sortTableAndIntercept('Format', 1);
  cy.get('tr[data-row-key="GF_MG8J1C62"]').find('[type="checkbox"]').check({force: true});
  cy.get('[class*="Header_ProTableHeader"] button[class*="ant-btn-default"]').eq(1).click({force: true});
  cy.clickAndIntercept('[class="ant-modal-footer"] button[class*="ant-btn-primary"]', 'POST', '**/file-manifest', 1);
  cy.waitUntilFile(oneMinute);
});

describe('Page Data Exploration (Data Files) - Télécharger le manifest', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kf_manifest_'+`${strDate.slice(0, 4)}${strDate.slice(4, 6)}${strDate.slice(6, 8)}`+'T*.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('DownloadManifest.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('DownloadManifest.json');
  });
});
