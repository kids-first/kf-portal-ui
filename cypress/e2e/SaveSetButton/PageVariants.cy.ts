/// <reference types="cypress"/>
import '../../support/commands';

describe('Page Variants - Bouton Save set', () => {

  beforeEach(() => {
    cy.login();
    cy.deleteSetIfExists('variants', 'Cypress_New_V');
    cy.deleteSetIfExists('variants', 'Cypress_V');
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').clickAndWait({force: true}); // data-cy="Tab_Biospecimens"
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').invoke('text').then((invokeText) => {
      cy.visitVariantsPage();
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
  
  it('Valider les fonctionnalités du bouton - Save as new set', () => {
    cy.saveSetAs('Cypress_New_V', 0);

    cy.get('[class*="ant-notification"]').contains('Your set has been saved.').should('exist');
    cy.get('[class*="ant-notification"]').contains('You can add your sets to a query from the dashboard.').should('exist');
    
    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').clickAndWait({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_New_V').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^1$/).clickAndWait({force: true});
  });

  it('Valider les fonctionnalités du bouton - Add to existing set', () => {
    cy.get('[class="ant-table-body"] [class*="ant-table-row"]').eq(1).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').clickAndWait({force: true});
    cy.get('[data-menu-id*="add_ids"]').clickAndWait({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_V').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_V').clickAndWait({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').clickAndWait({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_V').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^2$/).clickAndWait({force: true});
    });
    
  it('Valider les fonctionnalités du bouton - Remove from existing set', () => {
    cy.get('[class="ant-table-body"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').clickAndWait({force: true});
    cy.get('[data-menu-id*="remove_ids"]').clickAndWait({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_V').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_V').clickAndWait({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').clickAndWait({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_V').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^0$/).clickAndWait({force: true});
  });
});