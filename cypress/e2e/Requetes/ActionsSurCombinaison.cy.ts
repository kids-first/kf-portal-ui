/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=052992b6-4e42-4fda-a54b-fc6835b695fb');

  cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist');
});

describe('Page Data Exploration - Requêtes', () => {
  it('Supprimer une requête utilisée dans une combinaison', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_selected"] button[class*="QueryPill_close"]').clickAndWait();
    cy.wait('@getPOSTgraphql1');
    cy.wait('@getPOSTgraphql1');
    cy.wait('@getPOSTgraphql1');

    cy.get('[class*="QueryBar_queryBarWrapper"]').its('length').should('eq', 2);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000']);
    cy.validateTotalSelectedQuery(/\d{1}/);
    cy.validateTableResultsCount(/\d{1}/);
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(1).find('[class*="QueryValues_queryValuesContainer"]').contains('Q1').should('exist');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(1).find('[class*="QueryValues_queryValuesContainer"]').contains('Q2').should('not.exist');
    cy.validateClearAllButton(true);
  });
});
