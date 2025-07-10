/// <reference types="cypress"/>
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitDataExploration('datafiles', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.showColumn('Session');
  cy.showColumn('File Name');
  cy.showColumn('Platform');
  cy.showColumn('Repository');
  cy.showColumn('ACL');
  cy.showColumn('Access URL');
  cy.showColumn('Flywheel');
  cy.showColumn('Modality');
  cy.showColumn('Sequence Type');
  cy.showColumn('Technique');
  cy.showColumn('Body Part');
  cy.showColumn('Field Str.');
  cy.showColumn('Device Manufacturer');
  cy.showColumn('Device Model');
  cy.showColumn('Device ID');
  cy.get('[class*="Pagination"] span[class*="ant-select-selection-item"]').clickAndWait({force: true});
  cy.get('div[class*="ant-select-item-option-content"]').contains('50').clickAndWait({force: true});
  cy.wait(1000);

  cy.clickAndIntercept('div[id="content"] svg[data-icon="download"]', 'POST', '**/download', 1, false/*beVisible*/, 1);
  cy.waitUntilFile(oneMinute);
});

describe('Page Data Exploration (Data Files) - Exporter les fichiers en TSV', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-file-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauFiles.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauFiles.json');
  });
});
