/// <reference types="cypress"/>
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));
  cy.login();
  cy.visitFileEntity('GF_6DVS70V9');
  cy.resetColumns('experimental-procedure');
  cy.showColumn('Max Insert Size', 1/*eq*/);
  cy.showColumn('Mean Insert Size', 1/*eq*/);
  cy.showColumn('Mean Depth', 1/*eq*/);
  cy.showColumn('Mean Read Length', 1/*eq*/);
  cy.showColumn('Experiment Date', 1/*eq*/);
  cy.showColumn('Sequencing Center ID', 1/*eq*/);
  cy.get('div[id="content"] svg[data-icon="download"]').eq(2).clickAndWait({force:true});
  cy.waitUntilFile(oneMinute);
});

describe('Page d\'un fichier - Exporter le tableau Experimental Procedure en TSV', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-experimentalProcedure-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauExpProcPageFile.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauExpProcPageFile.json');
  });
});
