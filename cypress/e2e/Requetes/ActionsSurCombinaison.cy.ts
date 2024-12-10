/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=052992b6-4e42-4fda-a54b-fc6835b695fb');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').clickAndWait({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Supprimer une requête utilisée dans une combinaison', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_selected"] button[class*="QueryPill_close"]').clickAndWait();
    cy.wait('@getPOSTgraphql1');
    cy.wait('@getPOSTgraphql1');
    cy.wait('@getPOSTgraphql1');

    cy.get('[class*="QueryBar_queryBarWrapper"]').its('length').should('eq', 2);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000']);
    cy.validateTotalSelectedQuery(/(1,843|1,918|1,928|1,935|1,947|2,770|2,792|4,999|5,137|6,665|8,365|8,387|8,447)/);
    cy.validateTableResultsCount(/(1,843|1,918|1,928|1,935|1,947|2,770|2,792|4,999|5,137|6,665|8,365|8,387|8,447)/);
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(1).find('[class*="QueryValues_queryValuesContainer"]').contains('Q1').should('exist');
    cy.get('[class*="QueryBar_queryBarWrapper"]').eq(1).find('[class*="QueryValues_queryValuesContainer"]').contains('Q2').should('not.exist');
    cy.validateClearAllButton(true);
  });
});
