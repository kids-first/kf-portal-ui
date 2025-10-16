/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants');
  cy.showColumn('Race');
  cy.showColumn('Ethnicity');
  cy.showColumn('External Participant ID');
  cy.showColumn('Diagnosis (NCIT)');
  cy.showColumn('Diagnosis (Source Text)');
  cy.showColumn('Vital Status');
  cy.showColumn('Not Observed Phenotype (HPO)');
  cy.showColumn('Observed Phenotype (Source Text)');
});

describe('Page Data Exploration (Participants) - Valider les fonctionnalités du tableau', () => {
  it('Valider les fonctionnalités du tableau - Tri Participant ID', () => {
    cy.sortTableAndWait('Participant ID');
    cy.validateTableFirstRow(/^(?!-).*$/, 1, true);
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 1, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Study', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 2, true);
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 2, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Proband', () => {
    cy.sortTableAndIntercept('Proband', 1);
    cy.validateTableFirstRow('False', 4, true);
    cy.sortTableAndIntercept('Proband', 1);
    cy.validateTableFirstRow('True', 4, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Sex', () => {
    cy.sortTableAndIntercept('Sex', 1);
    cy.validateTableFirstRow(/(Female|-)/, 5, true);
    cy.sortTableAndIntercept('Sex', 1);
    cy.validateTableFirstRow('Unknown', 5, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Family ID', () => {
    cy.sortTableAndIntercept('Family ID', 1);
    cy.validateTableFirstRow('-', 8, true);
    cy.sortTableAndIntercept('Family ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 8, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Family Composition', () => {
    cy.sortTableAndIntercept('Family Composition', 1);
    cy.validateTableFirstRow('-', 9, true);
    cy.sortTableAndIntercept('Family Composition', 1);
    cy.validateTableFirstRow('Trio+', 9, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/^0$/, 11, true);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/\d{2}/, 11, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Files', () => {
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow(/^0$/, 12, true);
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow(/\d{3}/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Race', () => {
    cy.sortTableAndIntercept('Race', 1);
    cy.validateTableFirstRow('-', 13, true);
    cy.sortTableAndIntercept('Race', 1);
    cy.validateTableFirstRow('unknown', 13, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Ethnicity', () => {
    cy.sortTableAndIntercept('Ethnicity', 1);
    cy.validateTableFirstRow('-', 14, true);
    cy.sortTableAndIntercept('Ethnicity', 1);
    cy.validateTableFirstRow('unknown', 14, true);
  });

  it('Valider les fonctionnalités du tableau - Tri External Participant ID', () => {
    cy.sortTableAndIntercept('External Participant ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 15, true);
    cy.sortTableAndIntercept('External Participant ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 15, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Diagnosis (NCIT)', () => {
    cy.sortTableAndIntercept('Diagnosis (NCIT)', 1);
    cy.validateTableFirstRow('-', 16, true);
    cy.sortTableAndIntercept('Diagnosis (NCIT)', 1);
    cy.validateTableFirstRow('NCIT: C', 16, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Vital Status', () => {
    cy.sortTableAndIntercept('Vital Status', 1);
    cy.validateTableFirstRow('-', 18, true);
    cy.sortTableAndIntercept('Vital Status', 1);
    cy.validateTableFirstRow('Reported Unknown', 18, true);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('Sex', 1);
    cy.sortTableAndIntercept('Sex', 1);
    cy.sortTableAndWait('Participant ID');
    cy.sortTableAndWait('Participant ID');
    cy.validateTableFirstRow('PT_ZY', 1, true);
  });

  it('Valider les fonctionnalités du tableau - Pagination', () => {
    cy.get('span[class*="ant-select-selection-item"]').clickAndWait({force: true});
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
