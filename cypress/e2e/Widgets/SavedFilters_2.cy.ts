/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration();
  cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
  cy.createFilterIfNotExists('Cypress_FB');
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Saved Filters', () => {
  it('Vérifier les informations affichées - Nom', () => {
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress_FB').should('exist');
  });

  it('Vérifier les informations affichées - Stamp', () => {
    cy.get('[class*="SavedFilters_setTabs"]').contains('Last saved:').should('exist');
    cy.get('[class*="SavedFilters_setTabs"]').contains(' ago').should('exist');
  });

  it('Valider les liens disponibles - Nom', () => {
    cy.get('[class*="SavedFilters_setTabs"] [data-node-key*="variants"]').clickAndWait({force: true});
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress Variant Type Filter').clickAndWait({force: true});
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variant Exploration').should('exist');
    cy.get('[class*="PageContent_pageHeader"]').contains('Germline').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant Type').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('SNV').should('exist');
  });

  it('Valider les liens disponibles - Bouton Delete', () => {
    cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_FB')) {
        cy.wrap($el).find('svg[data-icon="delete"]').clickAndWait({force:true});
      }
    });
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-dangerous"]', 'POST', '**/graphql', 1);
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress_FB').should('not.exist');
  });
});
