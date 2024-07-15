/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Construire une première requête', () => {
    cy.get('body').contains('Use the search tools & facets on the left to build a query').should('exist');
    cy.validateTotalSelectedQuery(/\d{2}\.\d{1}K/);
    cy.validateTableResultsCount(/\d{2}\,\d{3}/);

    cy.checkValueFacetAndApply('Sample Type', 'DNA');

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validateTotalSelectedQuery(/(27K|26.1K|31.9K|32K)/);
    cy.validateTableResultsCount(/(26,073|26,978|26,998|31,933|31,953)/);
    cy.validateClearAllButton(false);
  });
});
