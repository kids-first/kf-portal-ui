/// <reference types="cypress"/>
import '../../support/commands';

describe('Page Data Exploration (Participants) - Bouton Save set', () => {

  beforeEach(() => {
    cy.login();
    cy.deleteSetIfExists('participants', 'Cypress_New_P');
    cy.deleteSetIfExists('participants', 'Cypress_P');
    cy.visitDataExploration('participants');
    cy.get('[data-cy="SidebarMenuItem_Participant"]').click({force: true});
    cy.createSetIfNotExists('Cypress_P', 0);
    cy.visitDataExploration('participants');
    cy.get('[data-cy="SidebarMenuItem_Participant"]').click({force: true});
  });

  it('Vérifier les informations affichées - Titre de la dropdown', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="participant-set-dropdown-container"] button').click({force: true});

    cy.get('[class="ant-dropdown-menu-title-content"]').contains('1 participant selected').should('exist');
  });

  it('Vérifier les informations affichées - Tooltip de la dropdown', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="participant-set-dropdown-container"] button').click({force: true});
    cy.get('[class="ant-dropdown-menu-title-content"] [data-icon="info-circle"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});

    cy.get('[class="ant-tooltip-inner"]').should('not.have.class', 'ant-tooltip-hidden');
    cy.get('[class="ant-tooltip-inner"]').contains('Max. 10,000 items at a time. The first 10,000 will be processed.').should('exist');
  });
  
  it('Valider les fonctionnalités du bouton - Save as new set', () => {
    cy.saveSetAs('Cypress_New_P', 0);

    cy.get('[class*="ant-notification"]').contains('Your set has been saved.').should('exist');
    cy.get('[class*="ant-notification"]').contains('You can add your sets to a query from the sidebar or the dashboard.').should('exist');
    
    cy.get('[class*="SetSearch_search"] input').type('Cypress_New_P', {force: true});
    cy.get('[class*="SetSearch_search"] [class*="ant-select-dropdown"]').contains('Cypress_New_P').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="participants"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_New_P').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^1$/).click({force: true});
  });

  it('Valider les fonctionnalités du bouton - Add to existing set', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(1).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').click({force: true});
    cy.get('[data-menu-id*="add_ids"]').click({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_P').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_P').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="participants"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_P').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^2$/).click({force: true});
    });
    
  it('Valider les fonctionnalités du bouton - Remove from existing set', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').click({force: true});
    cy.get('[data-menu-id*="remove_ids"]').click({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_P').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_P').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="participants"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_P').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^0$/).click({force: true});
  });
});

describe('Page Data Exploration (Biospecimens) - Bouton Save set', () => {

  beforeEach(() => {
    cy.login();
    cy.deleteSetIfExists('biospecimen', 'Cypress_New_B');
    cy.deleteSetIfExists('biospecimen', 'Cypress_B');
    cy.visitDataExploration('biospecimens');
    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
    cy.createSetIfNotExists('Cypress_B', 0);
    cy.visitDataExploration('biospecimens');
    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
  });

  it('Vérifier les informations affichées - Titre de la dropdown', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="biospecimen-set-dropdown-container"] button').click({force: true});

    cy.get('[class="ant-dropdown-menu-title-content"]').contains('1 biospecimen selected').should('exist');
  });

  it('Vérifier les informations affichées - Tooltip de la dropdown', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="biospecimen-set-dropdown-container"] button').click({force: true});
    cy.get('[class="ant-dropdown-menu-title-content"] [data-icon="info-circle"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});

    cy.get('[class="ant-tooltip-inner"]').should('not.have.class', 'ant-tooltip-hidden');
    cy.get('[class="ant-tooltip-inner"]').contains('Max. 10,000 items at a time. The first 10,000 will be processed.').should('exist');
  });
  
  it('Valider les fonctionnalités du bouton - Save as new set', () => {
    cy.saveSetAs('Cypress_New_B', 0);

    cy.get('[class*="ant-notification"]').contains('Your set has been saved.').should('exist');
    cy.get('[class*="ant-notification"]').contains('You can add your sets to a query from the sidebar or the dashboard.').should('exist');
    
    cy.get('[class*="SetSearch_search"] input').type('Cypress_New_B', {force: true});
    cy.get('[class*="SetSearch_search"] [class*="ant-select-dropdown"]').contains('Cypress_New_B').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="biospecimen"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_New_B').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^1$/).click({force: true});
  });

  it('Valider les fonctionnalités du bouton - Add to existing set', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(1).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').click({force: true});
    cy.get('[data-menu-id*="add_ids"]').click({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_B').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_B').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="biospecimen"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_B').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^2$/).click({force: true});
    });
    
  it('Valider les fonctionnalités du bouton - Remove from existing set', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').click({force: true});
    cy.get('[data-menu-id*="remove_ids"]').click({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_B').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_B').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="biospecimen"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_B').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^0$/).click({force: true});
  });
});

describe('Page Data Exploration (Data Files) - Bouton Save set', () => {

  beforeEach(() => {
    cy.login();
    cy.deleteSetIfExists('files', 'Cypress_New_F');
    cy.deleteSetIfExists('files', 'Cypress_F');
    cy.visitDataExploration('datafiles');
    cy.get('[data-cy="SidebarMenuItem_Data File"]').click({force: true});
    cy.createSetIfNotExists('Cypress_F', 0);
    cy.visitDataExploration('datafiles');
    cy.get('[data-cy="SidebarMenuItem_Data File"]').click({force: true});
  });

  it('Vérifier les informations affichées - Titre de la dropdown', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="file-set-dropdown-container"] button').click({force: true});

    cy.get('[class="ant-dropdown-menu-title-content"]').contains('1 file selected').should('exist');
  });

  it('Vérifier les informations affichées - Tooltip de la dropdown', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id="file-set-dropdown-container"] button').click({force: true});
    cy.get('[class="ant-dropdown-menu-title-content"] [data-icon="info-circle"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});

    cy.get('[class="ant-tooltip-inner"]').should('not.have.class', 'ant-tooltip-hidden');
    cy.get('[class="ant-tooltip-inner"]').contains('Max. 10,000 items at a time. The first 10,000 will be processed.').should('exist');
  });
  
  it('Valider les fonctionnalités du bouton - Save as new set', () => {
    cy.saveSetAs('Cypress_New_F', 0);

    cy.get('[class*="ant-notification"]').contains('Your set has been saved.').should('exist');
    cy.get('[class*="ant-notification"]').contains('You can add your sets to a query from the sidebar or the dashboard.').should('exist');
    
    cy.get('[class*="SetSearch_search"] input').type('Cypress_New_F', {force: true});
    cy.get('[class*="SetSearch_search"] [class*="ant-select-dropdown"]').contains('Cypress_New_F').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="files"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_New_F').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^1$/).click({force: true});
  });

  it('Valider les fonctionnalités du bouton - Add to existing set', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(1).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').click({force: true});
    cy.get('[data-menu-id*="add_ids"]').click({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_F').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_F').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="files"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_F').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^2$/).click({force: true});
    });
    
  it('Valider les fonctionnalités du bouton - Remove from existing set', () => {
    cy.get('div[role="tabpanel"] [class*="ant-table-row"]').eq(0).find('[type="checkbox"]').check({force: true});
    cy.get('[id*="-set-dropdown-container"] button').click({force: true});
    cy.get('[data-menu-id*="remove_ids"]').click({force: true});

    cy.get('[class*="ant-select-in-form-item"] input').focus().type('{enter}', {force: true});
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_F').parentsUntil('[class="ant-select-item-option-content"]').contains(/^1$/).should('exist');
    cy.get('[class*="ant-select-dropdown"]').contains('Cypress_F').click({force: true});
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('form[id="add-remove-set"]').should('not.exist');

    cy.get('[class*="ant-notification"]').contains('Success').should('exist');
    cy.get('[class*="ant-notification"]').contains('Your set has been updated.').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="files"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains('Cypress_F').parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="ListItem_count"]').contains(/^0$/).click({force: true});
  });
});
