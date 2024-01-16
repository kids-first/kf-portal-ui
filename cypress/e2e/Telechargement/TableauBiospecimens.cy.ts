/// <reference types="Cypress" />
import { getDateTime } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitDataExploration('biospecimens', '?sharedFilterId=c70ff0ec-e96d-4176-809c-2b744236fcf5');
  cy.showColumn('Anatomical Site (NCIT)');
  cy.showColumn('Anatomical Site (Source Text)');
  cy.showColumn('Histological Diagnosis (NCIT)');
  cy.showColumn('Histological Diagnosis (Source Text)');
  cy.showColumn('Tumor Location (Source Text)');
  cy.showColumn('Consent Code (dbGaP)');
  cy.showColumn('Consent Type');
  cy.showColumn('Method of Sample Procurement');
  cy.showColumn('Tumor Descriptor (Source Text)');
  cy.showColumn(/^Volume$/);
  cy.showColumn('Volume Unit');
  cy.showColumn('External Participant ID');
  cy.showColumn('External Sample ID');

  cy.clickAndIntercept('div[id="content"] svg[data-icon="download"]', 'POST', '**/download', 1, 1);
});

describe('Page Data Exploration (Biospecimens) - Exporter les biospecimens en TSV', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-biospecimen-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier [SKFP-809]', () => {
    cy.validateFileHeaders('ExportTableauBiospecimens.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauBiospecimens.json');
  });
});
