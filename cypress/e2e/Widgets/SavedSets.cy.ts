/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Dashboard - Widget Saved Sets', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Sets')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Managing Saved Sets').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('A saved set is a collection of one or more entity IDs which can be saved and revisited for later use. You can create saved sets at the top of the table of results in the ').should('exist');
  });

  it('Valider les liens disponibles - Data Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Sets')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Data Exploration').click({force: true});
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist');
  });

  it('Valider les liens disponibles - Variants Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Sets')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Variants Exploration').click({force: true});
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variants Exploration').should('exist');
  });
});

describe('Page Dashboard - Widget Saved Sets', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants');
    cy.get('[data-cy="SidebarMenuItem_Participant"]').click({force: true});
    cy.createSetIfNotExists('Cypress_SB', 0);
    cy.visitDashboard();
  });

  it('Vérifier les informations affichées - Nom', () => {
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SB').should('exist');
  });

  it('Vérifier les informations affichées - Stamp', () => {
    cy.get('[class*="SavedSets_setTabs"]').contains('Last saved:').should('exist');
    cy.get('[class*="SavedSets_setTabs"]').contains(' ago').should('exist');
  });

  it('Valider les liens disponibles - Nom', () => {
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="biospecimen"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Biospecimens').click({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Biospecimen').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Biospecimens').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="files"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Data Files').click({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Data Files').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').click({force: true});
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Variants').click({force: true});
    cy.get('[class*="VariantsTable_variantTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Variants').should('exist');
  });

  it('Valider les liens disponibles - Bouton Delete', () => {
    cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_SB')) {
        cy.wrap($el).find('svg[data-icon="delete"]').click({force:true});
      }
    });
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-dangerous"]', 'DELETE', '**/sets/**', 1);
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SB').should('not.exist');
  });
});

describe('Page Dashboard - Widget Saved Sets', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants');
    cy.get('[data-cy="SidebarMenuItem_Participant"]').click({force: true});
    cy.createSetIfNotExists('Cypress_SA', 0);
    cy.deleteSetIfExists('participants', 'Cypress_SB');
    cy.visitDashboard();
  });

  it('Valider les liens disponibles - Bouton Edit', () => {
    cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_SA')) {
        cy.wrap($el).find('svg[data-icon="edit"]').click({force:true});
      }
    });
    cy.get('[class="ant-modal-content"] input').clear().type('Cypress_SB');
    cy.get('[class="ant-modal-content"] input[value="Cypress_SB"]').should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SB').should('exist');
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SA').should('not.exist');
  });
});
