/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Data Files - Imaging) - Colonnes du tableau', () => {
  beforeEach(() => {
    cy.visitDataExploration('imaging');
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters').find('span[class*="anticon"]')
      .should('have.class', 'anticon-lock');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(0)
      .contains('File Authorization').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters').find('span[class*="anticon"]')
      .should('have.class', 'anticon-safety');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(1)
      .contains('Data Access').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(3)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('File ID').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(4)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Study').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Data Category').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(4)
      .contains('Data Category').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Data Type').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(5)
      .contains('Data Type').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Experimental Strategy').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(6)
      .contains('Experimental Strategy').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Format').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(7)
      .contains('Format').should('exist');
    
    cy.get('thead[class="ant-table-thead"]')
      .contains('Size').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(8)
      .contains('Size').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(5)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Participants').should('exist');
  
    cy.get('thead[class="ant-table-thead"]')
      .contains('Biospecimens').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(10)
      .contains('Biospecimens').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('File Name').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(11)
      .contains('File Name').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Platform').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(12)
      .contains('Platform').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Repository').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(13)
      .contains('Repository').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('ACL').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(14)
      .contains('ACL').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Access URL').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(15)
      .contains('Access URL').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(6)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Flywheel').should('exist');
    
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(7)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Modality').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(8)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Sequence Type').should('exist');

    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(9)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Technique').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(10)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Body Part').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(11)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Field Str.').should('exist');
  
    cy.get('thead[class="ant-table-thead"] th[class*="ant-table-cell"]').eq(12)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Manufacturer').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Device Model').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(23)
      .contains('Device Model').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Device ID').should('not.exist');
    cy.get('[class="ant-popover-inner"] [class*="ProTablePopoverColumnListWrapper"] [class="ant-space-item"]').eq(24)
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