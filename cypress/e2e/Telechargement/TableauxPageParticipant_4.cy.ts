/// <reference types="cypress"/>
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));
  cy.login();
  cy.visitParticipantEntity('PT_01236T3G');
  cy.resetColumns('biospecimen');
  cy.showColumn('Histological Diagnosis (MONDO)');
  cy.showColumn('Histological Diagnosis (NCIT)');
  cy.showColumn('Histological Diagnosis (Source Text)');
  cy.showColumn('Anatomical Site (NCIT)');
  cy.showColumn('Anatomical Site (Source Text)');
  cy.showColumn('Tumor Descriptor (Source Text)');
  cy.showColumn('Paired Normal Sample');
  cy.showColumn('Tumor Location (Source Text)');
  cy.showColumn('Consent Code (dbGaP)');
  cy.showColumn('Consent Type');
  cy.showColumn('Preservation Method');
  cy.showColumn(/^Volume$/);
  cy.showColumn('Volume Unit');
  cy.showColumn('Sample Availability');
  cy.showColumn('Parent Sample ID');
  cy.showColumn('Parent Sample Type');
  cy.showColumn('External Collection ID');
  cy.get('div[id="content"] svg[data-icon="download"]').eq(5).clickAndWait({force:true});
  cy.waitUntilFile(oneMinute);
});

describe('Page d\'un participant - Exporter le tableau Biospecimens en TSV', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-biospecimens-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauBiospecimensPageParticipant.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauBiospecimensPageParticipant.json');
  });
});
