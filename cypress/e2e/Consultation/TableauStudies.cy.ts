/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitStudiesPage();
});

describe('Page des études - Vérifier les informations affichées', () => {
  beforeEach(() => {
    cy.typeAndIntercept('[class*="PageContent_search"]', 'KF-CDH', 'POST', '**/graphql', 6);
  });

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
  });
});

describe('Page des études - Valider les liens disponibles', () => {
  beforeEach(() => {
    cy.typeAndIntercept('[class*="PageContent_search"]', 'KF-CDH', 'POST', '**/graphql', 6);
  });

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

describe('Page des études - Consultation du tableau', () => {
  it('Valider les fonctionnalités du tableau - Tri Code', () => {
    cy.sortTableAndWait('Code');
    cy.validateTableFirstRow(/^(?!-).*$/, 0);
    cy.sortTableAndIntercept('Code', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 0);
  });

  it('Valider les fonctionnalités du tableau - Tri Name', () => {
    cy.sortTableAndIntercept('Name', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 1);
    cy.sortTableAndIntercept('Name', 1);
    cy.validateTableFirstRow('Whole Genome Sequencing of African and Asian Orofacial Clefts Case-Parent Triads', 1);
  });

  it('Valider les fonctionnalités du tableau - Tri dbGaP', () => {
    cy.sortTableAndIntercept('dbGaP', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4);
    cy.sortTableAndIntercept('dbGaP', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Participants', () => {
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/\d{1}/, 5);
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/\d{1}/, 5);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow('50', 6);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/\d{1}/, 6);
  });

  it('Valider les fonctionnalités du tableau - Tri Families', () => {
    cy.sortTableAndIntercept('Families', 1);
    cy.validateTableFirstRow('-', 7);
    cy.sortTableAndIntercept('Families', 1);
    cy.validateTableFirstRow(/\d{1}/, 7);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('Families', 1);
    cy.sortTableAndWait('Biospecimens');
    cy.validateTableFirstRow('KF-MMC', 0);
  });
});