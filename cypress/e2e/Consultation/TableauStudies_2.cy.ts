/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitStudiesPage();
  cy.typeAndIntercept('[class*="PageContent_search"]', 'KF-CDH', 'POST', '**/graphql', 3);
});

describe('Page des études - Valider les liens disponibles', () => {
  it('Lien dbGap du tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class="ant-table-cell"]').eq(4).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001110');
  });

  it('Lien Participants du tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class="ant-table-cell"]').eq(5).find('[href]').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('KF-CDH').should('exist');
  });

  it('Lien Biospecimens du tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class="ant-table-cell"]').eq(6).find('[href]').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('KF-CDH').should('exist');
  });
});
