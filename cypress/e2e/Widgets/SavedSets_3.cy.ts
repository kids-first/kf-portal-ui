/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants');
  cy.get('[data-cy="SidebarMenuItem_Participant"]').clickAndWait({force: true});
  cy.createSetIfNotExists('Cypress_SA', 0);
  cy.deleteSetIfExists('participants', 'Cypress_SB');
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Saved Sets', () => {
  it('Valider les liens disponibles - Bouton Edit', () => {
    cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_SA')) {
        cy.wrap($el).find('svg[data-icon="edit"]').clickAndWait({force:true});
      }
    });
    cy.get('[class="ant-modal-content"] input[id="save-set_nameSet"]').filter(':visible').clear().type('Cypress_SB');
    cy.get('[class="ant-modal-content"] input[value="Cypress_SB"]').should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1, true/*beVisible*/);
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SB').should('exist');
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SA').should('not.exist');
  });
});
