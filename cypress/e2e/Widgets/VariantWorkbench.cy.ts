/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Dashboard - Widget Variant Workbench (déconnecté)', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('CAVATICA VWB — Data Studio').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('Access the Kids First variant database within your own high-performance compute environment using Cavatica’s').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('and combine participant clinical data with variant annotations. Copy a preloaded').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('in Cavatica before launching. Once your files are copied into a Cavatica project, you can explore and combine Kids First participant clinical data, variant annotations, and public external variant databases (such as Ensembl, gnomAD, dbNSFP, OMIM) in JupyterLab with PySpark to conduct statistical analyses, integrate multi-omics data, generate predictive models, and create compelling visualizations.').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('In order to access and copy variant data in a Cavatica project, you must have authorizations to access select NCI and Kids First controlled data. Connect to our data repository partners using your eRA Commons account to obtain controlled access to variant data.').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('Read more on').should('exist');
  });

  it('Valider les liens disponibles - Data Studio du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-inner-content"] a[href="https://docs.cavatica.org/docs/about-data-cruncher"]').contains('Data Studio').should('exist');
  });

  it('Valider les liens disponibles - Public project du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-inner-content"] a[href="https://cavatica.sbgenomics.com/u/sevenbridges/kids-first-variant-workbench"]').contains('public project').should('exist');
  });

  it('Valider les liens disponibles - Applying du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href="https://kidsfirstdrc.org/help-center/accessing-controlled-data-via-dbgap/"]').contains('applying for data access').should('exist');
  });

  it('Vérifier les informations affichées - Carte', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('[alt="Appache-Zeppelin-Logo"]').should('exist');
    cy.get('@gridCard').contains('Access the Kids First variant database within your own high-performance compute environment using Cavatica’s').should('exist');
    cy.get('@gridCard').contains('and combine participant clinical data with variant annotations. Copy a preloaded').should('exist');
    cy.get('@gridCard').contains('in Cavatica before launching.').should('exist');
    cy.get('@gridCard').find('button').contains('Connect').should('exist');
  });

  it('Valider les liens disponibles - Data Studio', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('a[href="https://docs.cavatica.org/docs/about-data-cruncher"]').contains('Data Studio').should('exist');
  });

  it('Valider les liens disponibles - Public project', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('a[href="https://cavatica.sbgenomics.com/u/sevenbridges/kids-first-variant-workbench"]').contains('public project').should('exist');
  });
});

describe('Page Dashboard - Widget Variant Workbench (connecté)', () => {
  beforeEach(() => {
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

  it('Vérifier les informations affichées - Carte', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('[alt="Appache-Zeppelin-Logo"]').should('exist');
    cy.get('@gridCard').contains('Access the Kids First variant database within your own high-performance compute environment using Cavatica’s').should('exist');
    cy.get('@gridCard').contains('and combine participant clinical data with variant annotations. Copy a preloaded').should('exist');
    cy.get('@gridCard').contains('in Cavatica before launching.').should('exist');
    cy.get('@gridCard').find('button').contains('Launch in Cavatica').should('exist');
  });

  it('Valider les liens disponibles - Bouton Launch in Cavatica', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });

    cy.intercept('GET', 'https://kf-cavatica-vwb-api-qa.kf-strides.org/vwb/manifest').as('cavaticaVwbManifest');
    cy.get('@gridCard').find('button').clickAndWait({force: true});
    cy.wait('@cavaticaVwbManifest');
  });
});
