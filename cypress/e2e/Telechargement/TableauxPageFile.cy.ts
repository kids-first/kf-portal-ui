/// <reference types="Cypress" />
import { getDateTime } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));
  cy.login();
});

describe('Page d\'un fichier - Exporter le tableau Participants-Samples en TSV', () => {
  beforeEach(() => {
    cy.visitFileEntity('GF_45BZQGS6');
    cy.resetColumns('participant-sample');
    cy.showColumn('Collection ID');
    cy.showColumn('External Participant ID');
    cy.get('div[id="content"] svg[data-icon="download"]').eq(1).click({force:true});
    cy.wait(1000);
  });
  
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-participantSample-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauParticipantsPageFile.json');
  });

  it('Valider le contenu du fichier [SKFP-778]', () => {
    cy.validateFileContent('ExportTableauParticipantsPageFile.json');
  });
});

describe('Page d\'un fichier - Exporter le tableau Experimental Procedure en TSV', () => {
  beforeEach(() => {
    cy.visitFileEntity('GF_45BZQGS6');
    cy.resetColumns('experimental-procedure');
    cy.get('div[id="content"] svg[data-icon="download"]').eq(2).click({force:true});
    cy.wait(1000);
  });
  
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-experimentalProcedure-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauExperimentalProcedurePageFile.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauExperimentalProcedurePageFile.json');
  });
});