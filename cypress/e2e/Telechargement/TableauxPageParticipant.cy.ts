/// <reference types="cypress"/>
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));
  cy.login();
});

describe('Page d\'un participant - Exporter le tableau Family en TSV', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('family');
    cy.get('div[id="content"] svg[data-icon="download"]').eq(1).clickAndWait({force:true});
    cy.wait(1000);
  });
  
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-family-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauFamilyPageParticipant.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauFamilyPageParticipant.json');
  });
});

describe('Page d\'un participant - Exporter le tableau Diagnoses en TSV', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('diagnosis');
    cy.get('div[id="content"] svg[data-icon="download"]').eq(2).clickAndWait({force:true});
    cy.waitUntilFile(oneMinute);
  });
  
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-diagnoses-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauDiagnosesPageParticipant.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauDiagnosesPageParticipant.json');
  });
});

describe('Page d\'un participant - Exporter le tableau Phenotypes en TSV', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('phenotype');
    cy.get('div[id="content"] svg[data-icon="download"]').eq(3).clickAndWait({force:true});
    cy.waitUntilFile(oneMinute);
  });
  
  it('Valider le nom du fichier', () => {
    cy.validateFileName('kidsfirst-phenotypes-table-'+`${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`+'.tsv');
  });

  it('Valider les en-têtes du fichier', () => {
    cy.validateFileHeaders('ExportTableauPhenotypesPageParticipant.json');
  });

  it('Valider le contenu du fichier', () => {
    cy.validateFileContent('ExportTableauPhenotypesPageParticipant.json');
  });
});

describe('Page d\'un participant - Exporter le tableau Biospecimens en TSV', () => {
  beforeEach(() => {
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