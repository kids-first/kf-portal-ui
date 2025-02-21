/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.showColumn('Race');
  cy.showColumn('Ethnicity');
  cy.showColumn('External Participant ID');
  cy.showColumn('Diagnosis (NCIT)');
  cy.showColumn('Diagnosis (Source Text)');
  cy.showColumn('Vital Status');
  cy.showColumn('Not Observed Phenotype (HPO)');
  cy.showColumn('Observed Phenotype (Source Text)');
});

describe('Page Data Exploration (Participants) - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(1).contains('PT_01236T3G').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(2).contains('KF-CDH').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(3).contains('phs001110').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(4).contains('True').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(5).contains('Female').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(5).find('[class*="ColorTag_genderFemale"]').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(6).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(6).contains('MONDO:').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(6).contains('0005711').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(7).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(7).contains('HP:').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(7).contains('0000776').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(8).contains('FM_Z4Y7FP70').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(9).contains('Trio').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(9).find('[class*="ant-tag-cyan"]').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(10).contains('-').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(11).contains(/^1$/).should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(12).contains(/\d{1}/).should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(13).contains('White').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(14).contains('Not Hispanic or Latino').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(15).contains('01-0665').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(16).contains('NCIT:').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(16).contains('C98893').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(17).contains(/congen(it|ti)al diaphragmatic hernia/).should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(18).contains('Deceased').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(19).contains('-').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(20).contains(/Congen(it|ti)al diaphragmatic hernia/).should('exist');
  });
});
