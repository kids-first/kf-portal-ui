/// <reference types="cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.intercept('GET', '**/fence/gen3/authenticated', {
    statusCode: 200,
    body: {
      "authenticated": true,
      "expiration": 1722785256
    },
  }).as('authStudiesAuthenticated');
  cy.intercept('POST', '**/authorized-studies', {
    statusCode: 200,
    body: {
      "gen3": {
          "data": [
              {
                  "study_id": "Study_ID",
                  "user_acl_in_study": [
                      "phs012345.cy",
                      "open_access"
                  ],
                  "study_code": "Study_Cypress",
                  "title": "Cypress: (Test) A mock study for Cypress tests",
                  "authorized_controlled_files_count": 1234,
                  "total_files_count": 5678,
                  "total_authorized_files_count": 3456
              }
          ],
          "error": false
      }
  },
  }).as('authStudiesList');

  cy.visitDashboard();
  cy.wait('@authStudiesAuthenticated');
  cy.wait('@authStudiesList');
});

describe('Page Dashboard - Widget Authorized Studies (connecté)', () => {
  it('Vérifier les informations affichées - Header', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Authorized Studies')) {
        cy.wrap($el).as('authStudiesCard');
      }
    });

    cy.get('@authStudiesCard').contains('Authorized Studies (1)').should('exist');
    cy.get('@authStudiesCard').find('[class*="widget_authenticatedHeader"]').contains('You have access to the following Kids First controlled data.').should('exist');
    cy.get('@authStudiesCard').find('[class*="widget_authenticatedHeader"] button').contains('Manage your connections').should('exist');
  });

  it('Vérifier les informations affichées - Study', () => {
      cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
        if ($el.text().includes('Authorized Studies')) {
          cy.wrap($el).as('authStudiesCard');
        }
      });
  
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('Cypress: (Test) A mock study for Cypress tests').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('Authorization').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('3,456').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('of').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('5,678').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('files').should('exist');

      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('Data use groups:').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('phs012345.cy').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"]').contains('open_access').should('exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"] [class="ant-progress-bg"]').should('have.attr', 'style').and('match', /61%/);
      cy.get('@authStudiesCard').find('[class*="widget_list"] [data-icon="check-circle"]').should('not.exist');
      cy.get('@authStudiesCard').find('[class*="widget_list"] [class="ant-progress-text"]').contains('61%').should('exist');
    });

  it('Valider les liens disponibles - Manage Connections', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Authorized Studies')) {
        cy.wrap($el).as('authStudiesCard');
      }
    });

    cy.get('@authStudiesCard').find('[class*="widget_authenticatedHeader"] button').clickAndWait({force: true});
    cy.get('[class="ant-modal-title"]').contains('Manage Connections').should('exist');
    cy.get('[class="ant-modal-body"]').contains('Access select NCI and Kids First controlled access data by connecting your account using your NIH login credentials. Please remember that it is your responsibility to follow any data use limitations with controlled access data.').should('exist');
    cy.get('[class="ant-modal-body"]').contains('Kids First Framework Services').should('exist');
    cy.get('[class="ant-modal-body"]').contains('NCI CRDC Framework Services').should('exist');
    cy.get('button[class*="ant-btn-primary"]').contains('Close').should('exist');
  });

  it('Valider les liens disponibles - Fichiers autorisés', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Authorized Studies')) {
        cy.wrap($el).as('authStudiesCard');
      }
    });

    cy.get('@authStudiesCard').find('[href="/data-exploration/datafiles"]').eq(0).clickAndWait({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist');
    cy.validatePillSelectedQuery('Study Code', ['Study Cypress']);
    cy.validatePillSelectedQuery('ACL', ['Phs012345.cy','Open Access'], 1);
  });
});
