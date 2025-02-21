/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsSomaticPage();
  cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
  cy.deleteFilterIfExists('Cypress_F0');
});

describe('Page des variants (Somatic) - Filtres', () => {
  it('Créer un nouveau filtre', () => {
    cy.saveFilterAs('Cypress_F0');

    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F0$/).should('exist');
    cy.validateSelectedFilterInDropdown('Cypress_F0');
    cy.validateFilterInManager('Cypress_F0', 'exist');
    cy.validateIconStates('plus', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', false/*isDisable*/, false/*isDirty*/);
  });
});
