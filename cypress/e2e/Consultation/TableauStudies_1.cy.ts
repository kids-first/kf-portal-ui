/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitStudiesPage();
  cy.typeAndIntercept('[class*="PageContent_search"]', 'KF-CDH', 'POST', '**/graphql', 3);
});

describe('Page des études - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Studies').should('exist'); // data-cy="Title_Studies"
  });

  it('Tableau', () => {
    cy.validateTableFirstRow('KF-CDH', 0);
    cy.validateTableFirstRow('KF-CDH', 0);
    cy.validateTableFirstRow('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', 1);
    cy.validateTableFirstRow('Kids First', 2);
    cy.validateTableFirstRow('Birth Defect', 3);
    cy.validateTableFirstRow('phs001110', 4);
    cy.validateTableFirstRow('2,030', 5);
    cy.validateTableFirstRow('2,121', 6);
    cy.validateTableFirstRow('753', 7);
    cy.get('tr[class*="ant-table-row"] [class="ant-table-cell"]').eq(8).find('[data-icon="check"]').should('exist');
    cy.validateTableFirstRow('-', 9);
    cy.validateTableFirstRow('-', 10);
    cy.validateTableFirstRow('-', 11);
  });

  it('Summary', () => {
    cy.get('tfoot [class*="summaryTitle"]').eq(0).contains('Participants').should('exist');
    cy.get('tfoot [class*="summarySum"]').eq(0).contains(/\d{1}/).should('exist');
    cy.get('tfoot [class*="summaryTitle"]').eq(1).contains('Biospecimens').should('exist');
    cy.get('tfoot [class*="summarySum"]').eq(1).contains(/\d{1}/).should('exist');
    cy.get('tfoot [class*="summaryTitle"]').eq(2).contains('Families').should('exist');
    cy.get('tfoot [class*="summarySum"]').eq(2).contains(/\d{1}/).should('exist');
  });
});
