/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitFileEntity('GF_6DVS70V9');
  cy.resetColumns('experimental-procedure');
});

describe('Page d\'un fichier - Colonnes du tableau Experimental Procedure', () => {
  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Experimental Strategy').should('exist');
    
    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Sequencing Type').should('exist');
    
    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Platform').should('exist');

    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Instrument Model').should('exist');
  
    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Library Strand').should('exist');

    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(5)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Library Name').should('exist');

    cy.get('[id="experimental-procedure"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(6)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Total Reads').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Max Insert Size').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(8)
      .contains('Max Insert Size').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Mean Insert Size').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(9)
      .contains('Mean Insert Size').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Mean Depth').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(10)
      .contains('Mean Depth').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Mean Read Length').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(11)
      .contains('Mean Read Length').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Experiment Date').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(12)
      .contains('Experiment Date').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Sequencing Center ID').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(13)
      .contains('Sequencing Center ID').should('exist');
  });
});
