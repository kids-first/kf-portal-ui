/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitStudiesPage();
});

describe('Page des études - Rechercher des études', () => {
  it('Par study code', () => {
    cy.typeAndIntercept('[class*="PageContent_search"]', 'cdh', 'POST', '**/graphql', 3);
    cy.validateTableResultsCount(/1 Result/);
    cy.validateTableFirstRow('KF-CDH', 0);

    cy.get('button[class*="Header_clearFilterLink"]').should('contain', 'Clear filters').clickAndWait({force: true});
    cy.validateTableResultsCount(/\d{1} Results/);
  });

  it('Par study name', () => {
    cy.typeAndIntercept('[class*="PageContent_search"]', 'PHRA', 'POST', '**/graphql', 3);
    cy.validateTableResultsCount(/1 Result/);
    cy.validateTableFirstRow('KF-CDH', 0);

    cy.get('button[class*="Header_clearFilterLink"]').should('contain', 'Clear filters').clickAndWait({force: true});
    cy.validateTableResultsCount(/\d{1} Results/);
  });

  it('Par dbGaP', () => {
    cy.typeAndIntercept('[class*="PageContent_search"]', 'S001110', 'POST', '**/graphql', 3);
    cy.validateTableResultsCount(/1 Result/);
    cy.validateTableFirstRow('phs001110', 4);

    cy.get('button[class*="Header_clearFilterLink"]').should('contain', 'Clear filters').clickAndWait({force: true});
    cy.validateTableResultsCount(/\d{1} Results/);
  });
});
