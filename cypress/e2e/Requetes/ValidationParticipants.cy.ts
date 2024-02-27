/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=0909e7e7-27e1-4e05-a15b-9742b5a2b43f');
  });

  it('Validation Facette numérique ou No Data', () => {
    cy.validateTotalSelectedQuery('15.8K');
    cy.validateTableResultsCount('15,799');
  });

  it('Validation Facette numérique OU Facette standard', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(3).click();
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validateTotalSelectedQuery('15.7K');
    cy.validateTableResultsCount('15,707');
  });

  it('Validation Facette numérique ou No Data ET Facette standard', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(4).click();
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validateTotalSelectedQuery('15.7K');
    cy.validateTableResultsCount('15,707');
  });

  it('Validation Facette standard (Any of)', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(5).click();
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validateTotalSelectedQuery('15.8K');
    cy.validateTableResultsCount('15,799');
  });

  it('Validation Facette standard (All of)', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(6).click();
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validateTotalSelectedQuery('592');
    cy.validateTableResultsCount('592');
  });

  it('Validation Facette standard (None of)', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(7).click();
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validateTotalSelectedQuery('60');
    cy.validateTableResultsCount('60');
  });

  it('Validation Facette standard (None of) ET Facette numérique', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(8).click();
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validateTotalSelectedQuery('74');
    cy.validateTableResultsCount('74');
  });
});
