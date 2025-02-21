/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('datafiles');
});

describe('Page Data Exploration (Data Files) - Valider les fonctionnalités du tableau', () => {
  it('Valider les fonctionnalités du tableau - Tri File ID', () => {
    cy.sortTableAndWait('File ID',);
    cy.validateTableFirstRow(/^(?!-).*$/, 3, true);
    cy.sortTableAndIntercept('File ID', 1);
    cy.validateTableFirstRow('GF_ZZZYCMZQ', 3, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Study', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4, true);
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Data Category', () => {
    cy.sortTableAndIntercept('Data Category', 1);
    cy.validateTableFirstRow('-', 5, true);
    cy.sortTableAndIntercept('Data Category', 1);
    cy.validateTableFirstRow('Transcriptomics', 5, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Data Type', () => {
    cy.sortTableAndIntercept('Data Type', 1);
    cy.validateTableFirstRow('-', 6, true);
    cy.sortTableAndIntercept('Data Type', 1);
    cy.validateTableFirstRow('gVCF', 6, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Experimental Strategy', () => {
    cy.sortTableAndIntercept('Experimental Strategy', 1);
    cy.validateTableFirstRow('-', 7, true);
    cy.sortTableAndIntercept('Experimental Strategy', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 7, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Format', () => {
    cy.sortTableAndIntercept('Format', 1);
    cy.validateTableFirstRow('bam', 8, true);
    cy.sortTableAndIntercept('Format', 1);
    cy.validateTableFirstRow('vcf', 8, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Size', () => {
    cy.sortTableAndIntercept('Size', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 9, true);
    cy.sortTableAndIntercept('Size', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 9, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Participants', () => {
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/^1$/, 10, true);
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/\d{1}/, 10, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/(^0$|^1$)/, 11, true);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/\d{1}/, 11, true);
  });

  it('Valider les fonctionnalités du tableau - Tri File Name', () => {
    cy.showColumn('File Name');
    cy.sortTableAndIntercept('File Name', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
    cy.sortTableAndIntercept('File Name', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Platform', () => {
    cy.showColumn('Platform');
    cy.sortTableAndIntercept('Platform', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Platform', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Repository', () => {
    cy.showColumn('Repository');
    cy.sortTableAndIntercept('Repository', 1);
    cy.validateTableFirstRow(/(-|^(?!-).*$)/, 12, true);
    cy.sortTableAndIntercept('Repository', 1);
    cy.validateTableFirstRow('Gen3', 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri ACL', () => {
    cy.showColumn('ACL');
    cy.sortTableAndIntercept('ACL', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('ACL', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Access URL', () => {
    cy.showColumn('Access URL');
    cy.sortTableAndIntercept('Access URL', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Access URL', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Flywheel', () => {
    cy.showColumn('Flywheel');
    cy.sortTableAndIntercept('Flywheel', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Flywheel', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Modality', () => {
    cy.showColumn('Modality');
    cy.sortTableAndIntercept('Modality', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Modality', 1);
    cy.validateTableFirstRow('MR', 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Sequence Type', () => {
    cy.showColumn('Sequence Type');
    cy.sortTableAndIntercept('Sequence Type', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Sequence Type', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Technique', () => {
    cy.showColumn('Technique');
    cy.sortTableAndIntercept('Technique', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Technique', 1);
    cy.validateTableFirstRow('Structural', 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Body Part', () => {
    cy.showColumn('Body Part');
    cy.sortTableAndIntercept('Body Part', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Body Part', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Field Str.', () => {
    cy.showColumn('Field Str.');
    cy.sortTableAndIntercept('Field Str.', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Field Str.', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Manufacturer', () => {
    cy.showColumn('Manufacturer');
    cy.sortTableAndIntercept('Manufacturer', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Manufacturer', 1);
    cy.validateTableFirstRow('Toshiba', 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Device Model', () => {
    cy.showColumn('Device Model');
    cy.sortTableAndIntercept('Device Model', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Device Model', 1);
    cy.validateTableFirstRow('Verio', 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Device ID', () => {
    cy.showColumn('Device ID');
    cy.sortTableAndIntercept('Device ID', 1);
    cy.validateTableFirstRow('-', 12, true);
    cy.sortTableAndIntercept('Device ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndWait('Format');
    cy.sortTableAndWait('Size');
    cy.validateTableFirstRow(/^(?!-).*$/, 9, true);
  });

  it('Valider les fonctionnalités du tableau - Pagination', () => {
    cy.get('[class*="Pagination"] span[class*="ant-select-selection-item"]').clickAndWait({force: true});
    cy.get('div[class*="ant-select-item-option-content"]').contains('20').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('be.disabled');

    cy.get('button[type="button"]').contains('Next').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('button[type="button"]').contains('Next').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^41$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^60$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('button[type="button"]').contains('Prev.').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('button[type="button"]').contains('First').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('be.disabled');
  });
});
