/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').clickAndWait({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Construire une première requête', () => {
    cy.get('body').contains('Use the search tools & facets on the left to build a query').should('exist');
    cy.validateTotalSelectedQuery(/\d{2}\.\d{1}K/);
    cy.validateTableResultsCount(/\d{2}\,\d{3}/);

    cy.checkValueFacetAndApply('Sample Type', 'DNA');

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.wait(5000);
    cy.validateTotalSelectedQuery(/\d{1}K/);
    cy.validateTableResultsCount(/\d{2}\,\d{3}/);
    cy.validateClearAllButton(false);
  });
});
