/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('biospecimens', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.showColumn('Anatomical Site (NCIT)');
  cy.showColumn('Anatomical Site (Source Text)');
  cy.showColumn('Histological Diagnosis (NCIT)');
  cy.showColumn('Histological Diagnosis (Source Text)');
  cy.showColumn('Tumor Location (Source Text)');
  cy.showColumn('Consent Code (dbGaP)');
  cy.showColumn('Consent Type');
  cy.showColumn('Preservation Method');
  cy.showColumn('Method of Sample Procurement');
  cy.showColumn('Tumor Descriptor (Source Text)');
  cy.showColumn('Paired Normal Sample');
  cy.showColumn(/^Volume$/);
  cy.showColumn('Volume Unit');
  cy.showColumn('External Participant ID');
  cy.showColumn('External Sample ID');
  cy.showColumn('External Collection ID');
  cy.sortTableAndIntercept('Study', 1);
});

describe('Page Data Exploration (Biospecimens) - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(1).contains('BS_KB0GZCP5').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(2).contains('KF-CDH').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(3).contains('DNA').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(4).contains('SA_KWGNQQQ8').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(5).contains('Leukocyte').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(6).contains('PT_01236T3G').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(7).contains('SA_KWGNQQQ8').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(8).contains('Leukocyte').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(9).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(10).contains('Normal').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(11).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(12).contains('No').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(13).contains(/\d{1}/).should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(14).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(15).contains('Other').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(16).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(17).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(18).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(19).contains('phs001110.c1').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(20).contains('GRU').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(21).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(22).contains('Not Reported').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(23).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(24).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(25).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(26).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(27).contains('01-0665').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(28).contains('01-0665').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(29).contains('-').should('exist');
  });
});
