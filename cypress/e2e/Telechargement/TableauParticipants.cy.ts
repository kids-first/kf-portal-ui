/// <reference types="cypress"/>
import { getDateTime } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
  cy.showColumn('Race');
  cy.showColumn('Ethnicity');
  cy.showColumn('External Participant ID');
  cy.showColumn('Diagnosis (NCIT)');
  cy.showColumn('Diagnosis (Source Text)');
  cy.showColumn('Vital Status');
  cy.showColumn('Not Observed Phenotype (HPO)');
  cy.showColumn('Observed Phenotype (Source Text)');
  cy.wait(1000);

  cy.clickAndIntercept('div[id="content"] svg[data-icon="download"]', 'POST', '**/download', 1, 1);
});

describe('Page Data Exploration (Participants) - Exporter les participants en TSV', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-participant-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier [SKFP-809]', () => {
    cy.validateFileHeaders('ExportTableauParticipants.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauParticipants.json');
  });
});
