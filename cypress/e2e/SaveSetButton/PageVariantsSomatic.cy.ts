/// <reference types="cypress"/>
import '../../support/commands';

describe('Page Variants (Somatic) - Bouton Save set', () => {

  beforeEach(() => {
    cy.login();
    cy.deleteSetIfExists('variants', 'Cypress_New_V');
    cy.deleteSetIfExists('variants', 'Cypress_V');
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').clickAndWait({force: true}); // data-cy="Tab_Biospecimens"
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').invoke('text').then((invokeText) => {
      cy.visitVariantsSomaticPage();
      if (!invokeText.includes('Cypress_V')) {
        cy.saveSetAs('Cypress_V', 0);
      };
    });
  });

  it('Vérifier les informations affichées - Titre de la dropdown', () => {
    cy.get('[class="ant-table-body"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="variants-set-dropdown-container"] button').clickAndWait({force: true});

    cy.get('[class="ant-dropdown-menu-title-content"]').contains('1 variant selected').should('exist');
  });

  it('Vérifier les informations affichées - Tooltip de la dropdown', () => {
    cy.get('[class="ant-table-body"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="variants-set-dropdown-container"] button').clickAndWait({force: true});
    cy.get('[class="ant-dropdown-menu-title-content"] [data-icon="info-circle"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});

    cy.get('[class="ant-tooltip-inner"]').should('not.have.class', 'ant-tooltip-hidden');
    cy.get('[class="ant-tooltip-inner"]').contains('Max. 10,000 items at a time. The first 10,000 will be processed.').should('exist');
  });
});