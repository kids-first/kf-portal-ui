/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Dashboard - Widget Biospecimen Requests', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Your Request History').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('This card holds the history of your biospecimen requests. You can reload them in the ').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains(' or share the link.').should('exist');
  });

  it('Valider les liens disponibles - Data Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Data Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist');
  });
});

describe('Page Dashboard - Widget Biospecimen Requests', () => {
  beforeEach(() => {
    cy.createBioReqIfNotExists('Cypress_BrB', 0);
    cy.visitDashboard();
  });

  it('Vérifier les informations affichées - Nom [SKFP-1282]', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').should('exist');
  });

  it('Vérifier les informations affichées - Stamp', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Last saved:').should('exist');
    cy.get('@dashboardCard').contains(' ago').should('exist');
  });

  it('Valider les liens disponibles - Nom', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Biospecimen').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('Cypress_BrB').should('exist');
  });

  // Ne fonctionne pas, le popup "Copy to clipboard: ⌘+C, Enter" s'affiche et bloque le test
  it.skip('Valider les liens disponibles - Bouton ShareUrl', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').find('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_BrA')) {
        cy.wrap($el).find('svg[data-icon="share-alt"]').clickAndWait({force:true});
      };
    });
    // TODO: Récupérer l'rul copié et la valider
  });

  it('Valider les liens disponibles - Bouton Delete', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').should('exist');
    cy.deleteBioReqIfExists('Cypress_BrB');
  });
});

describe('Page Dashboard - Widget Biospecimen Requests', () => {
  beforeEach(() => {
    cy.createBioReqIfNotExists('Cypress_BrA', 0);
    cy.deleteBioReqIfExists('Cypress_BrB');
    cy.visitDashboard();
  });

  it('Valider les liens disponibles - Bouton Edit [SKFP-1282]', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').find('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_BrA')) {
        cy.wrap($el).find('svg[data-icon="edit"]').clickAndWait({force:true});
      };
    });
    cy.get('[class="ant-modal-content"] input').clear().type('Cypress_BrB');
    cy.get(`[class="ant-modal-content"] input[value="Cypress_BrB"]`).should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1);

    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').should('exist');
    cy.get('@dashboardCard').contains('Cypress_BrA').should('not.exist');
  });
});
