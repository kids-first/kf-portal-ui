/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitStudiesPage();
});

describe('Page des études - Consultation du tableau', () => {
  it('Valider les fonctionnalités du tableau - Tri Code', () => {
    cy.sortTableAndWait('Code');
    cy.validateTableFirstRow(/^(?!-).*$/, 0);
    cy.sortTableAndIntercept('Code', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 0);
  });

  it('Valider les fonctionnalités du tableau - Tri Name', () => {
    cy.sortTableAndIntercept('Name', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 1);
    cy.sortTableAndIntercept('Name', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 1);
  });

  it('Valider les fonctionnalités du tableau - Tri dbGaP', () => {
    cy.sortTableAndIntercept('dbGaP', 1);
    cy.validateTableFirstRow(/(-|^(?!-).*$)/, 4);
    cy.sortTableAndIntercept('dbGaP', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Participants', () => {
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/\d{1}/, 5);
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/\d{1}/, 5);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/\d{1}/, 6);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/\d{1}/, 6);
  });

  it('Valider les fonctionnalités du tableau - Tri Families', () => {
    cy.sortTableAndIntercept('Families', 1);
    cy.validateTableFirstRow(/(-|\d{1})/, 7);
    cy.sortTableAndIntercept('Families', 1);
    cy.validateTableFirstRow(/\d{1}/, 7);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('Families', 1);
    cy.sortTableAndWait('Biospecimens');
    cy.validateTableFirstRow(/^(?!-).*$/, 0);
  });
});
