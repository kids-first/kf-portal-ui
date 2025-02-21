/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration();
  cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
  cy.createFilterIfNotExists('Cypress_FA');
  cy.deleteFilterIfExists('Cypress_FB');
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Saved Filters', () => {
  it('Valider les liens disponibles - Bouton Edit', () => {
    cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_FA')) {
        cy.wrap($el).find('svg[data-icon="edit"]').clickAndWait({force:true});
      }
    });
    cy.get('[class="ant-modal-content"] input[id="title"]').filter(':visible').clear().type('Cypress_FB');
    cy.get(`[class="ant-modal-content"] input[value="Cypress_FB"]`).should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/saved-filters', 1, true/*beVisible*/);
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress_FB').should('exist');
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress_FA').should('not.exist');
  });
});
