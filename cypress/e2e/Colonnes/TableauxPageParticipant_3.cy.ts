/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitParticipantEntity('PT_01236T3G');
  cy.resetColumns('phenotype');
});

describe('Page d\'un participant - Colonnes du tableau Phenotypes', () => {
  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Phenotype (HPO)').should('exist');
    
    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Phenotype (Source Text)').should('exist');

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Interpretation').should('exist');

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Age').should('exist');

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('HPO Term').should('exist');
  });

  it('Masquer/Afficher une colonne affichée', () => {
    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Phenotype (HPO)').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Phenotype (HPO)')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Phenotype (HPO)').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Phenotype (HPO)')
      .find('[type="checkbox"]').check({force: true});

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Phenotype (HPO)').should('exist');
  });
});
