/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('datafiles', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.showColumn('File Name');
  cy.showColumn('Platform');
  cy.showColumn('Repository');
  cy.showColumn('ACL');
  cy.showColumn('Access URL');
  cy.showColumn('Flywheel');
  cy.showColumn('Modality');
  cy.showColumn('Sequence Type');
  cy.showColumn('Technique');
  cy.showColumn('Body Part');
  cy.showColumn('Field Str.');
  cy.showColumn('Device Manufacturer');
  cy.showColumn('Device Model');
  cy.showColumn('Device ID');
  cy.sortTableAndIntercept('Data Category', 1);
  cy.get('[class*="Pagination"] span[class*="ant-select-selection-item"]').clickAndWait({force: true});
  cy.get('div[class*="ant-select-item-option-content"]').contains('100').clickAndWait({force: true});
});

describe('Page Data Exploration (Data Files) - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(1).find('svg[data-icon="lock"]').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(2).contains('C').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(2).find('[class*="ant-tag-geekblue"]').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(3).contains('GF_6DVS70V9').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(4).contains('KF-CDH').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(5).contains('Genomics').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(6).contains('Simple Nucleotide Variations').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(7).contains('WGS').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(8).contains(/^vcf$/).should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(9).contains('3.04 GB').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(10).contains(/^3$/).should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(11).contains(/^3$/).should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(12).contains('2882b453-28b8-4238-bf7a-c4e0ff015a28.multi.vqsr.filtered.denovo.vep_105.vcf.gz').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(13).contains('Not Reported').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(14).contains('Gen3').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(15).contains('phs001110.c1').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(16).contains('drs://data.kidsfirstdrc.org/37cdb370-cda3-4504-be1b-f59cf6f785de').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(17).find('[class*="anticon"]').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(18).contains('MR').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(19).contains('Diffusion').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(20).contains('Functional').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(21).contains('CTSPINE').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(22).contains('1.3717760004328263').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(23).contains('Canon').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(24).contains('Avanto_fit').should('exist');
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(25).contains('de-pea26nptxz').should('exist');
  });
});
