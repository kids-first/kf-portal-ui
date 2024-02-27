/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page des études - Colonnes du tableau', () => {
  beforeEach(() => {
    cy.visitStudiesPage();
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Code').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Name').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Program').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Domain').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('dbGaP').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(5)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Participants').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(6)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Biospecimens').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(7)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Families').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(8)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Genomics').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(9)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Transcriptomics').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(10)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Proteomics').should('exist');
  });

  it('Masquer/Afficher une colonne affichée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('Name').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Name')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('Name').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Name')
      .find('[type="checkbox"]').check({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('Name').should('exist');
  });
});