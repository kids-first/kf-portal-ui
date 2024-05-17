/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=245ad812-f2a3-4401-9506-a98c647c3779');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Éditer une pilule via la facette', () => {
    cy.checkValueFacetAndApply('Sample Type', 'RNA');

    cy.validatePillSelectedQuery('Sample Type', ['DNA','RNA']);
    cy.validateTotalSelectedQuery(/(27.1K|26.2K)/);
    cy.validateTableResultsCount(/(27,106|26,173)/);
    cy.validateClearAllButton(false);
  });

  it('Éditer une pilule via son popup', () => {
    cy.get('[class*="QueryValues_queryValuesContainer"]').contains('DNA').click({force:true});
    cy.get('[class*="filtersDropdown"] input[id="input-RNA"]').check({force: true});
    cy.clickAndIntercept('[class*="filtersDropdown"] [data-cy="Apply_Sample Type"]', 'POST', '**/graphql', 15);

    cy.validatePillSelectedQuery('Sample Type', ['DNA','RNA']);
    cy.validateTotalSelectedQuery(/(27.1K|26.2K)/);
    cy.validateTableResultsCount(/(27,106|26,173)/);
    cy.validateClearAllButton(false);
  });

  it('Ajouter une pilule à une requête', () => {
    cy.checkValueFacetAndApply('Collection Sample Type', 'Saliva');

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validatePillSelectedQuery('Collection Sample Type', ['Saliva'], 1);
    cy.validateOperatorSelectedQuery('and');
    cy.validateTotalSelectedQuery(/(3,200|3,181)/);
    cy.validateTableResultsCount(/(3,200|3,181)/);
    cy.validateClearAllButton(false);
  });

  it('Construire une deuxième requête', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('button[class*="QueryTools_button"]').contains('New query').click({force:true});
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});
    };

    cy.get('body').contains('Use the search tools & facets on the left to build a query').should('exist');
    cy.validateTotalSelectedQuery(/\d{2}\.\d{1}K/);
    cy.validateTableResultsCount(/\d{2}\,\d{3}/);
    cy.validateClearAllButton(false);

    cy.get('[data-cy="SidebarMenuItem_Study"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
    cy.checkValueFacetAndApply('Study Code', 'KF-CDH');

    cy.validatePillSelectedQuery('Study Code', ['KF-CDH']);
    cy.validateTotalSelectedQuery('2,031');
    cy.validateTableResultsCount('2,031');
    cy.validateClearAllButton(true);
  });

  it('Dupliquer une requête', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_selected"]').find('[data-icon="copy"]').click({force: true});
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validateTotalSelectedQuery(/(26.9K|26.1K)/);
    cy.validateTableResultsCount(/(26,912|26,073)/);
    cy.validateClearAllButton(true);
  });
});
