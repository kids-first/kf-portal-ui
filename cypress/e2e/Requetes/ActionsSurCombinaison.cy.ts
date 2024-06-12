/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=052992b6-4e42-4fda-a54b-fc6835b695fb');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Supprimer une requête utilisée dans une combinaison', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_selected"]').find('button[class*="QueryPill_close"]').click();
    cy.wait('@getPOSTgraphql1', {timeout: 20*1000});
    cy.wait('@getPOSTgraphql1', {timeout: 20*1000});
    cy.wait('@getPOSTgraphql1', {timeout: 20*1000});

    cy.get('[class*="QueryBar_queryBarWrapper"]').its('length').should('eq', 2);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000']);
    cy.validateTotalSelectedQuery(/(1,843|2,770|2,792)/);
    cy.validateTableResultsCount(/(1,843|2,770|2,792)/);
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(1).find('[class*="QueryValues_queryValuesContainer"]').contains('Q1').should('exist');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(1).find('[class*="QueryValues_queryValuesContainer"]').contains('Q2').should('not.exist');
    cy.validateClearAllButton(true);
  });
});
