/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsSomaticPage();
});

describe('Page des variants (Somatic) - Colonnes du tableau', () => {
  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Variant').should('exist');
    
    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Type').should('exist');
  
    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('dbSNP').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Gene').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(5)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Most Deleterious Consequence').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(6)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('MANE').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(7)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('OMIM').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(8)
      .should('have.class', 'ant-table-column-has-sorters')
      .find('[data-icon="fire"]').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(9)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('CMC').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(10)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Tier').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(11)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('ClinVar').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains(/^gnomAD$/).should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(11)
      .contains(/^gnomAD$/).should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('gnomAD ALT').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(12)
      .contains('gnomAD ALT').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(12)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Studies').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(13)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Part.').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('CADD').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(15)
      .contains('CADD').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('REVEL').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(16)
      .contains('REVEL').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains(/^ALT$/).should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(17)
      .contains(/^ALT$/).should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Homo.').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(18)
      .contains('Homo.').should('exist');
  });

  it('Masquer une colonne affichée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('Type').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Type')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('Type').should('not.exist');
  });

  it('Afficher une colonne masquée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('CADD').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('CADD')
      .find('[type="checkbox"]').check({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('CADD').should('exist');
  });
});