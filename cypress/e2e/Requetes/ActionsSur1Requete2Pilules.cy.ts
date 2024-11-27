/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=c32c1174-fad6-4e02-a6eb-09e1454e2d21');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').clickAndWait({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Modifier l\'opérateur d\'une requête', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('[class*="QueryBar_selected"] [class*="Combiner_operator"]').clickAndWait({force: true});
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql1');
    };

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000'], 1);
    cy.validateOperatorSelectedQuery('or');
    cy.validateTotalSelectedQuery(/(26.1K|26.2K|27.1K|32.7K|32.8K|32.9K)/);
    cy.validateTableResultsCount(/(26,073|26,205|26,215|26,234|26,246|27,072|27,094|32,675|32,697|32,760|32,913|32,926)/);
    cy.validateClearAllButton(false);

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql2');
    cy.get('[class*="QueryBar_selected"] [class*="Combiner_operator"]').clickAndWait({force: true});
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql2');
    };

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000'], 1);
    cy.validateOperatorSelectedQuery('and');
    cy.validateTotalSelectedQuery(/(1,843|1,918|1,928|1,935|1,945|2,676|2,696|4,219|5,885|7,623|7,643|7,705)/);
    cy.validateTableResultsCount(/(1,843|1,918|1,928|1,935|1,945|2,676|2,696|4,219|5,885|7,623|7,643|7,705)/);
    cy.validateClearAllButton(false);
  });

  it('Supprimer une des pilules d\'une requête avec le X', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('.simplebar-wrapper').invoke('css', 'overflow', 'visible');
    cy.get('[class*="QueryBar_selected"] button[class*="QueryPill_close"]').eq(0).clickAndWait();
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql');
    };

    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000']);
    cy.validateTotalSelectedQuery(/(1,843|1,918|1,928|1,935|1,947|2,770|2,792|4,999|6,665|8,365|8,387|8,447)/);
    cy.validateTableResultsCount(/(1,843|1,918|1,928|1,935|1,947|2,770|2,792|4,999|6,665|8,365|8,387|8,447)/);
    cy.validateClearAllButton(false);
  });
});
