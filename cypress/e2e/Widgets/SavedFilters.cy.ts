/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Dashboard - Widget Saved Filters', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Filters')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Managing Saved Filters').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('A saved filter is a virtual query created by applying one or more filters to a data set. They can be saved and revisited for later use. You can create and manage saved filters from the query builder at the top of the ').should('exist');
  });

  it('Valider les liens disponibles - Data Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Filters')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Data Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist');
  });

  it('Valider les liens disponibles - Variants Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Filters')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Variants Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variants Exploration').should('exist');
  });
});

describe('Page Dashboard - Widget Saved Filters', () => {
  beforeEach(() => {
    cy.visitDataExploration();
    cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
    cy.createFilterIfNotExists('Cypress_FB');
    cy.visitDashboard();
  });

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
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variants Exploration').should('exist');
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

describe('Page Dashboard - Widget Saved Filters', () => {
  beforeEach(() => {
    cy.visitDataExploration();
    cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
    cy.createFilterIfNotExists('Cypress_FA');
    cy.deleteFilterIfExists('Cypress_FB');
    cy.visitDashboard();
  });

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
