/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsSomaticPage();
  cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
  cy.deleteFilterIfExists('Cypress_Fedit1');
  cy.deleteFilterIfExists('Cypress_F1 COPY');
  cy.createFilterIfNotExists('Cypress_F1');
});

describe('Page des variants (Somatic) - Filtres', () => {
  it('Sélectionner un filtre dans la dropdown', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').clickAndWait({force: true});

    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F1$/).should('exist');
    cy.validateSelectedFilterInDropdown('Cypress_F1');
    cy.validateIconStates('plus', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', false/*isDisable*/, false/*isDirty*/);
  });

  it('Renommer un filtre par la querybar', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains(/^Cypress_F1$/).clickAndWait({force: true});
    cy.saveFilterAs('Cypress_Fedit1');

    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_Fedit1$/).should('exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains(/^Cypress_F1$/).should('not.exist');
    cy.validateSelectedFilterInDropdown('Cypress_Fedit1');
    cy.validateFilterInManager('Cypress_F1', 'not.exist');
    cy.validateFilterInManager('Cypress_Fedit1', 'exist');
    cy.validateIconStates('plus', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', false/*isDisable*/, false/*isDirty*/);
  });

  it('Renommer un filtre par le manager', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
    cy.get('[data-menu-id*="manage-my-filters"]').clickAndWait({force: true});
    cy.get('[class="ant-modal-content"]').contains(/^Cypress_F1$/).parentsUntil('li[class*="ListItemWithActions"]').parent().find('[data-icon="edit"]').clickAndWait({force: true});
    cy.get('[class="ant-modal-content"] input').clear().type('Cypress_Fedit1');
    cy.get(`[class="ant-modal-content"] input[value="Cypress_Fedit1"]`).should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/saved-filters/**', 1, false/*beVisible*/, 1);
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[class*="ant-dropdown-menu-item"]').contains(/^Cypress_F1$/).should('not.exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_Fedit1').should('exist');
    cy.validateFilterInManager('Cypress_F1', 'not.exist');
    cy.validateFilterInManager('Cypress_Fedit1', 'exist');
  });

  it('Dupliquer un filtre sans sauvegarder', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').clickAndWait({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="copy"]').clickAndWait({force: true});
    
    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F1 COPY$/).should('exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1 COPY').should('not.exist');
    cy.validateFilterInManager('Cypress_F1 COPY', 'not.exist');
    cy.validateIconStates('plus', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', true/*isDisable*/, false/*isDirty*/);
  });

  it('Dupliquer un filtre et sauvegarder', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').clickAndWait({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="copy"]').clickAndWait({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="save"]').clickAndWait({force: true});
    
    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F1 COPY$/).should('exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1 COPY').should('not.exist');
    cy.validateFilterInManager('Cypress_F1 COPY', 'not.exist');
    cy.validateIconStates('plus', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', true/*isDisable*/, false/*isDirty*/);
  });
});
