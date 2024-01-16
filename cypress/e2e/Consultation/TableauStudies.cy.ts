/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitStudiesPage();
});

describe('Page des études - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Studies').should('exist'); // data-cy="Title_Studies"
  });

  it('Tableau', () => {
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(0).contains('KF-CHD').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(1).contains('National Heart, Lung, and Blood Institute (NHLBI) Bench to Bassinet Program: The Gabriella Miller Kids First Pediatric Research Program of the Pediatric Cardiac Genetics Consortium (PCGC)').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(2).contains('Kids First').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(3).contains('Birth Defect').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(4).contains('phs001138').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(5).contains('2,966').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(6).contains('2,987').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(7).contains('914').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(8).find('[data-icon="check"]').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(9).contains('-').should('exist');
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(10).contains('-').should('exist');
  });
});

describe('Page des études - Valider les liens disponibles', () => {
  it('Lien dbGap du tableau', () => {
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(4).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001138');
  });

  it('Lien Participants du tableau', () => {
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(5).find('[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-CHD').should('exist');
  });

  it('Lien Biospecimens du tableau', () => {
    cy.get('tr[data-row-key="z6SE140B0vNaqxcC8FQ7"]').find('[class="ant-table-cell"]').eq(6).find('[href]').click({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-CHD').should('exist');
  });
});

describe('Page des études - Consultation du tableau', () => {
  it('Valider les fonctionnalités du tableau - Tri Code', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndWait('Code');
    cy.validateTableFirstRow('KF-CDH', 0);
    cy.sortTableAndIntercept('Code', 1);
    cy.validateTableFirstRow('PBTA-PNOC', 0);
  });

  it('Valider les fonctionnalités du tableau - Tri Name', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Name', 1);
    cy.validateTableFirstRow('Discovering the Genetic Basis of Human Neuroblastoma: A Gabriella Miller Kids First Pediatric Research Program (Kids First) Project', 1);
    cy.sortTableAndIntercept('Name', 1);
    cy.validateTableFirstRow('Whole Genome Sequencing of African and Asian Orofacial Clefts Case-Parent Triads', 1);
  });

  it('Valider les fonctionnalités du tableau - Tri dbGaP', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('dbGaP', 1);
    cy.validateTableFirstRow('-', 4);
    cy.sortTableAndIntercept('dbGaP', 1);
    cy.validateTableFirstRow('phs002595', 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Participants', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/^77$/, 5);
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow('2,966', 5);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow('276', 6);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow('3,062', 6);
  });

  it('Valider les fonctionnalités du tableau - Tri Families', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Families', 1);
    cy.validateTableFirstRow('-', 7);
    cy.sortTableAndIntercept('Families', 1);
    cy.validateTableFirstRow('914', 7);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Participants', 1);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow('PBTA-PNOC', 0);
  });
});