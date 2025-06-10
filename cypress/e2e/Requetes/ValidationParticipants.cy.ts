/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=5aad94e2-162d-4f56-8085-59d7d3c27dfa');
});

describe('Page Data Exploration - Requêtes', () => {
  it('Validation Facette numérique ou No Data', () => {
    cy.validateTotalSelectedQuery('5,905');
    cy.validateTableResultsCount('5,905');
  });

  it('Validation Facette numérique OU Facette standard', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(3).clickAndWait();
    cy.wait('@getPOSTgraphql');

    cy.validateTotalSelectedQuery('5,559');
    cy.validateTableResultsCount('5,559');
  });

  it('Validation Facette numérique ou No Data ET Facette standard', () => {
    cy.get('[data-cy="SidebarMenuItem_Study"]').clickAndWait({force: true}); // Pour éviter de cliquer sur l'opérateur et le changer
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(4).clickAndWait();
    cy.wait('@getPOSTgraphql');

    cy.validateTotalSelectedQuery('5,559');
    cy.validateTableResultsCount('5,559');
  });

  it('Validation Facette standard (Any of)', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(5).clickAndWait();
    cy.wait('@getPOSTgraphql');

    cy.validateTotalSelectedQuery('5,571');
    cy.validateTableResultsCount('5,571');
  });

  it('Validation Facette standard (All of)', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(6).clickAndWait();
    cy.wait('@getPOSTgraphql');

    cy.validateTotalSelectedQuery('574');
    cy.validateTableResultsCount('574');
  });

  it('Validation Facette standard (None of)', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(7).clickAndWait();
    cy.wait('@getPOSTgraphql');

    cy.validateTotalSelectedQuery('410');
    cy.validateTableResultsCount('410');
  });

  it('Validation Facette standard (None of) ET Facette numérique', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(8).clickAndWait();
    cy.wait('@getPOSTgraphql');

    cy.validateTotalSelectedQuery('0');
    cy.validateTableResultsCount('No Results');
  });
});
