/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('datafiles');
});

describe('Page Data Exploration (Data Files) - Colonnes du tableau', () => {
  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .find('span[class*="anticon"]')
      .should('have.class', 'anticon-lock');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(0)
      .contains('File Authorization').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .find('span[class*="anticon"]')
      .should('have.class', 'anticon-safety');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(1)
      .contains('Data Access').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(3)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('File ID').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(4)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Study').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(5)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Data Category').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(6)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Data Type').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(7)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Experimental Strategy').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(8)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Format').should('exist');
    
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(9)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Size').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(10)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Participants').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Session').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(10)
      .contains('Session').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(11)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Biospecimens').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('File Name').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(12)
      .contains('File Name').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Platform').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(13)
      .contains('Platform').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Repository').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(14)
      .contains('Repository').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('ACL').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(15)
      .contains('ACL').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Access URL').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(16)
      .contains('Access URL').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Flywheel').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(17)
      .contains('Flywheel').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Modality').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(18)
      .contains('Modality').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Sequence Type').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(19)
      .contains('Sequence Type').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Technique').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(20)
      .contains('Technique').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Body Part').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(21)
      .contains('Body Part').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Field Str.').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(22)
      .contains('Field Str.').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Manufacturer').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(23)
      .contains('Manufacturer').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Device Model').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(24)
      .contains('Device Model').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Device ID').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(25)
      .contains('Device ID').should('exist');
  });

  it('Masquer une colonne affichée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('Study').should('exist');

    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]')
      .contains('Study').find('[type="checkbox"]').uncheck({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('Study').should('not.exist');
  });

  it('Afficher une colonne masquée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('File Name').should('not.exist');

    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]')
      .contains('File Name').find('[type="checkbox"]').check({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('File Name').should('exist');
  });
});