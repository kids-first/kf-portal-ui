/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsPage();
  cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').click({force: true});
  cy.waitWhileSpin(2000);
});

describe('Page des variants - Filtres', () => {
  beforeEach(() => {
    cy.deleteFilterIfExists('Cypress_F0');
  });

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

describe('Page des variants - Filtres', () => {
  beforeEach(() => {
    cy.deleteFilterIfExists('Cypress_Fedit1');
    cy.deleteFilterIfExists('Cypress_F1 COPY');
    cy.createFilterIfNotExists('Cypress_F1');
  });

  it('Sélectionner un filtre dans la dropdown', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').click({force: true});

    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F1$/).should('exist');
    cy.validateSelectedFilterInDropdown('Cypress_F1');
    cy.validateIconStates('plus', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', false/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', false/*isDisable*/, false/*isDirty*/);
  });

  it('Renommer un filtre par la querybar', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains(/^Cypress_F1$/).click({force: true});
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
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[data-menu-id*="manage-my-filters"]').click({force: true});
    cy.get('[class="ant-modal-content"]').contains(/^Cypress_F1$/).parentsUntil('li[class*="ListItemWithActions"]').parent().find('[data-icon="edit"]').click({force: true});
    cy.get('[class="ant-modal-content"] input').clear().type('Cypress_Fedit1');
    cy.get(`[class="ant-modal-content"] input[value="Cypress_Fedit1"]`).should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/saved-filters/**', 1, 1);
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[class*="ant-dropdown-menu-item"]').contains(/^Cypress_F1$/).should('not.exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_Fedit1').should('exist');
    cy.validateFilterInManager('Cypress_F1', 'not.exist');
    cy.validateFilterInManager('Cypress_Fedit1', 'exist');
  });

  it('Dupliquer un filtre sans sauvegarder [SKFP-1020]', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').click({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="copy"]').click({force: true});
    
    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F1 COPY$/).should('exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1 COPY').should('not.exist');
    cy.validateFilterInManager('Cypress_F1 COPY', 'not.exist');
    cy.validateIconStates('plus', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', false/*isDisable*/, true/*isDirty*/);
    cy.validateIconStates('copy', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', true/*isDisable*/, false/*isDirty*/);
  });

  it('Dupliquer un filtre et sauvegarder [SKFP-1020]', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').click({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="copy"]').click({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="save"]').click({force: true});
    
    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Cypress_F1 COPY$/).should('exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1 COPY').should('not.exist');
    cy.validateFilterInManager('Cypress_F1 COPY', 'not.exist');
    cy.validateIconStates('plus', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', false/*isDisable*/, true/*isDirty*/);
    cy.validateIconStates('copy', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', true/*isDisable*/, false/*isDirty*/);
  });

  // Ne fonctionne pas, le popup "Copy to clipboard: ⌘+C, Enter" s'affiche et bloque le test
  it.skip('Copier l\'url d\'un filtre', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F1').click({force: true});
    cy.get('[id="query-builder-header-tools"] [data-icon="share-alt"]').click({force: true});
    // TODO: Récupérer l'rul copié et la valider
  });
});

describe('Page des variants - Filtres', () => {
  beforeEach(() => {
    cy.createFilterIfNotExists('Cypress_F2');
  });

  it('Supprimer un filtre par la querybar', () => {
    cy.deleteFilter('Cypress_F2');
    
    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(/^Untitled Filter$/).should('exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F2').should('not.exist');
    cy.validateFilterInManager('Cypress_F2', 'not.exist');
    cy.validateIconStates('plus', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', true/*isDisable*/, false/*isDirty*/);
  });

  it('Supprimer un filtre par le manager', () => {
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[data-menu-id*="manage-my-filters"]').click({force: true});
    cy.get('[class="ant-modal-content"]').contains('Cypress_F2').parentsUntil('li[class*="ListItemWithActions"]').parent().find('[data-icon="delete"]').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-dangerous"]', 'POST', '**/graphql', 1);
    cy.get('button[class="ant-modal-close"]').invoke('click');
    
    cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains('Cypress_F2').should('not.exist');
    cy.get('[class*="ant-dropdown-menu-item"]').contains('Cypress_F2').should('not.exist');
    cy.validateFilterInManager('Cypress_F2', 'not.exist');
    cy.validateIconStates('plus', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('save', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('copy', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('delete', true/*isDisable*/, false/*isDirty*/);
    cy.validateIconStates('share-alt', true/*isDisable*/, false/*isDirty*/);
  });
});
