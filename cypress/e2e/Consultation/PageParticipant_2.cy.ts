/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitParticipantEntity('PT_01236T3G');
});

describe('Page d\'un participant - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="EntityTitle"]').contains('PT_01236T3G');
  });

  it('Panneau Summary', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains(/^1$/); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains('Study'); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains(/^1$/); // data-cy="SummaryHeader_Biospecimens_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains(/^Biospecimen$/); // data-cy="SummaryHeader_Biospecimens_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains(/\d{1}/); // data-cy="SummaryHeader_Files_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains('Files'); // data-cy="SummaryHeader_Files_Button"
    cy.get('[id="summary"] [class="ant-collapse-header"]').contains('Summary').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(0).contains('ID').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(0).contains('PT_01236T3G').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(1).contains('Ext. Participant ID').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(1).contains('01-0665').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(2).contains('Study').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(2).contains('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia (KF-CDH)').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(3).contains('dbGaP').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(3).contains('phs001110').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(4).contains('PedcBioPortal').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(4).contains('-').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(5).contains('Family Composition').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(5).contains('Trio').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(5).find('[class*="ant-tag-cyan"]').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(6).contains('Proband').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(6).contains('True').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(6).find('[class*="ant-tag-green"]').should('exist');
  });

  it('Panneau Profile', () => {
    cy.get('[id="profile"] [class*="EntityDescriptions_title"]').contains('Profile').should('exist');
    cy.get('[id="profile"] [class="ant-collapse-header"]').contains('Profile').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-label"]').eq(0).contains('Race').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-content"]').eq(0).contains('White').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-label"]').eq(1).contains('Ethnicity').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-content"]').eq(1).contains('Not Hispanic or Latino').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-label"]').eq(2).contains('Sex').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-content"]').eq(2).contains('Female').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-content"]').eq(2).find('[class*="ant-tag-magenta"]').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-label"]').eq(3).contains('Vital Status').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-content"]').eq(3).contains('Deceased').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-label"]').eq(4).contains('Age at Vital Status').should('exist');
    cy.get('[id="profile"] [class="ant-descriptions-item-content"]').eq(4).contains('-').should('exist');
  });
  
  it('Panneau Family (sans famille)', () => {
    cy.visitParticipantEntity('PT_004FA63H');
    cy.get('[id="family"]').should('not.exist');
  });

  it('Panneau Family (avec famille)', () => {
    cy.resetColumns('family');
    cy.get('[id="family"] [class*="EntityTable_title"]').contains('Family').should('exist');
    cy.get('[id="family"] [class="ant-collapse-header"]').contains('Family').should('exist');
    cy.get('[id="family"] [class="ant-collapse-header"]').contains(' (').should('exist');
    cy.get('[id="family"] [class="ant-collapse-header"]').contains('FM_Z4Y7FP70').should('exist');
    cy.get('[id="family"] [class="ant-collapse-header"]').contains(')').should('exist');
    cy.get('[id="family"] thead th[class="ant-table-cell"]').eq(0).contains('Participant ID').should('exist');
    cy.get('[id="family"] thead th[class="ant-table-cell"]').eq(1).contains('Family Relationship').should('exist');
    cy.get('[data-row-key="PT_01236T3G"] td[class="ant-table-cell"]').eq(0).contains('PT_01236T3G').should('exist');
    cy.get('[data-row-key="PT_01236T3G"] td[class="ant-table-cell"]').eq(1).contains('Proband').should('exist');
    cy.get('[data-row-key="PT_1DYA8779"] td[class="ant-table-cell"]').eq(0).contains('PT_1DYA8779').should('exist');
    cy.get('[data-row-key="PT_1DYA8779"] td[class="ant-table-cell"]').eq(1).contains('Mother').should('exist');
    cy.get('[data-row-key="PT_RZVC67GC"] td[class="ant-table-cell"]').eq(0).contains('PT_RZVC67GC').should('exist');
    cy.get('[data-row-key="PT_RZVC67GC"] td[class="ant-table-cell"]').eq(1).contains('Father').should('exist');
  });
  
  it('Panneau Diagnoses', () => {
    cy.resetColumns('diagnosis');
    cy.get('[id="diagnosis"] [class*="EntityTable_title"]').contains('Diagnosis').should('exist');
    cy.get('[id="diagnosis"] [class="ant-collapse-header"]').contains('Diagnosis').should('exist');
    cy.get('[id="diagnosis"] [class="ant-collapse-header"]').contains('(1)').should('exist');
    cy.get('[id="diagnosis"] thead th[class*="Participants_diagnosisCell"]').contains('Diagnosis (MONDO)').should('exist');
    cy.get('[id="diagnosis"] thead th[class="ant-table-cell"]').eq(0).contains('Diagnosis (NCIT)').should('exist');
    cy.get('[id="diagnosis"] thead th[class="ant-table-cell"]').eq(1).contains('Diagnosis (Source Text)').should('exist');
    cy.get('[id="diagnosis"] thead th[class="ant-table-cell"]').eq(2).contains('Age').should('exist');
    cy.get('[id="diagnosis"] thead th[class="ant-table-cell"]').eq(3).contains('MONDO Term').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class*="Participants_diagnosisCell"]').contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class*="Participants_diagnosisCell"]').contains('MONDO:').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class*="Participants_diagnosisCell"]').contains('0005711').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class="ant-table-cell"]').eq(0).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class="ant-table-cell"]').eq(0).contains('NCIT:').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class="ant-table-cell"]').eq(0).contains('C98893').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class="ant-table-cell"]').eq(1).contains(/congen(it|ti)al diaphragmatic hernia/).should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class="ant-table-cell"]').eq(2).contains('-').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"] td[class="ant-table-cell"]').eq(3).contains(/\d{1}/).should('exist');
  });
  
  it('Panneau Phenotypes', () => {
    cy.resetColumns('phenotype');
    cy.get('[id="phenotype"] [class*="EntityTable_title"]').contains('Phenotype').should('exist');
    cy.get('[id="phenotype"] [class="ant-collapse-header"]').contains('Phenotype').should('exist');
    cy.get('[id="phenotype"] [class="ant-collapse-header"]').contains('(2)').should('exist');
    cy.get('[id="phenotype"] thead th[class="ant-table-cell"]').eq(0).contains('Phenotype (HPO)').should('exist');
    cy.get('[id="phenotype"] thead th[class="ant-table-cell"]').eq(1).contains('Phenotype (Source Text)').should('exist');
    cy.get('[id="phenotype"] thead th[class="ant-table-cell"]').eq(2).contains('Interpretation').should('exist');
    cy.get('[id="phenotype"] thead th[class="ant-table-cell"]').eq(3).contains('Age').should('exist');
    cy.get('[id="phenotype"] thead th[class="ant-table-cell"]').eq(4).contains('HPO Term').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(0).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(0).contains('HP').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(0).contains('0000776').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(1).contains('congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(2).contains('Observed').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(2).find('[class*="ant-tag-green"]').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"] td[class="ant-table-cell"]').eq(4).contains(/\d{1}/).should('exist');
  });
  
  it('Panneau Biospecimens', () => {
    cy.resetColumns('biospecimen');
    cy.showColumn('Histological Diagnosis (MONDO)');
    cy.showColumn('Histological Diagnosis (NCIT)');
    cy.showColumn('Histological Diagnosis (Source Text)');
    cy.showColumn('Anatomical Site (NCIT)');
    cy.showColumn('Anatomical Site (Source Text)');
    cy.showColumn('Tumor Descriptor (Source Text)');
    cy.showColumn('Paired Normal Sample');
    cy.showColumn('Tumor Location (Source Text)');
    cy.showColumn('Consent Code (dbGaP)');
    cy.showColumn('Consent Type');
    cy.showColumn('Preservation Method');
    cy.showColumn(/^Volume$/);
    cy.showColumn('Volume Unit');
    cy.showColumn('Sample Availability');
    cy.showColumn('Parent Sample ID');
    cy.showColumn('Parent Sample Type');
    cy.showColumn('External Collection ID');
    cy.get('[id="biospecimen"] [class*="EntityTable_title"]').contains('Biospecimen').should('exist');
    cy.get('[id="biospecimen"] [class="ant-collapse-header"]').contains('Biospecimen').should('exist');
    cy.get('[id="biospecimen"] [class="ant-collapse-header"]').contains('(1)').should('exist');
    cy.get('[id="biospecimen"] [class="ant-collapse-header"]').contains('View in exploration').should('exist');
    cy.get('[id="biospecimen"] [class="ant-collapse-header"] svg[class="anticon"]').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(0).contains('Sample ID').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(1).contains('Collection ID').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(2).contains('Sample Type').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(3).contains('Collection Sample Type').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(4).contains('Age').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(5).contains('Tumor Status').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(6).contains('Histological Diagnosis (MONDO)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(7).contains('Histological Diagnosis (NCIT)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(8).contains('Histological Diagnosis (Source Text)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(9).contains('Anatomical Site (NCIT)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(10).contains('Anatomical Site (Source Text)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(11).contains('Tumor Descriptor (Source Text)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(12).contains('Paired Normal Sample').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(13).contains('Tumor Location (Source Text)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(14).contains('Consent Code (dbGaP)').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(15).contains('Consent Type').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(16).contains('Preservation Method').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(17).contains('Volume').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(18).contains('Volume Unit').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(19).contains('Sample Availability').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(20).contains('Parent Sample ID').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(21).contains('Parent Sample Type').should('exist');
    cy.get('[id="biospecimen"] thead th[class*="ant-table-cell"]').eq(22).contains('External Collection ID').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(0).contains('BS_KB0GZCP5').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(1).contains('SA_KWGNQQQ8').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(2).contains('DNA').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(3).contains('Leukocyte').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(4).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(5).contains('Normal').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(6).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(7).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(8).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(9).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(10).contains('Other').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(11).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(12).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(13).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(14).contains('phs001110.c1').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(15).contains('GRU').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(16).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(17).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(18).contains('-').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(19).contains('No').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(20).contains('SA_KWGNQQQ8').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(21).contains('Leukocyte').should('exist');
    cy.get('[id="biospecimen"] td[class*="ant-table-cell"]').eq(22).contains('-').should('exist');
  });
  
  it('Panneau Files', () => {
    cy.get('[id="files"] [class*="EntityTable_title"]').contains('Data File').should('exist');
    cy.get('[id="files"] [class="ant-collapse-header"]').contains('Data File').should('exist');
    cy.get('[id="files"] [class="ant-collapse-header"]').contains('(32)').should('exist');
    cy.get('[id="files"] [class="ant-collapse-header"]').contains('View in exploration').should('exist');
    cy.get('[id="files"] [class="ant-collapse-header"] svg[class="anticon"]').should('exist');
    cy.get('[id="files"] [class*="EntityTable_subTitle"]').eq(0).contains('File counts by Data Category').should('exist');
    cy.get('[id="files"] [class*="EntityTable_contentTable"]').eq(0).find('thead th[class="ant-table-cell"]').eq(0).contains('Data Category').should('exist');
    cy.get('[id="files"] [class*="EntityTable_contentTable"]').eq(0).find('thead th[class="ant-table-cell"]').eq(1).contains('Files').should('exist');
    cy.get('[id="files"] [class*="EntityTable_contentTable"]').eq(0).find('thead th[class="ant-table-cell"]').eq(2).contains('(n=32)').should('exist');
    cy.get('[id="files"] [data-row-key="Genomics"] td[class="ant-table-cell"]').eq(1).contains(/^32$/).should('exist');
    cy.get('[id="files"] [data-row-key="Genomics"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 100%"]').should('exist');
    cy.get('[id="files"] [data-row-key="Transcriptomics"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="Transcriptomics"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="Imaging"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="Imaging"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');

    cy.get('[id="files"] [class*="EntityTable_subTitle"]').eq(1).contains('File counts by Experimental Strategy').should('exist');
    cy.get('[id="files"] [class*="EntityTable_contentTable"]').eq(1).find('thead th[class="ant-table-cell"]').eq(0).contains('Experimental Strategy').should('exist');
    cy.get('[id="files"] [class*="EntityTable_contentTable"]').eq(1).find('thead th[class="ant-table-cell"]').eq(1).contains('Files').should('exist');
    cy.get('[id="files"] [class*="EntityTable_contentTable"]').eq(1).find('thead th[class="ant-table-cell"]').eq(2).contains('(n=32)').should('exist');
    cy.get('[id="files"] [data-row-key="WGS"] td[class="ant-table-cell"]').eq(1).contains(/^32$/).should('exist');
    cy.get('[id="files"] [data-row-key="WGS"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 100%"]').should('exist');
    cy.get('[id="files"] [data-row-key="RNA-Seq"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="RNA-Seq"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="Whole Genome Sequencing"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="Whole Genome Sequencing"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="WXS"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="WXS"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="RNA Sequencing"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="RNA Sequencing"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="Linked-Read WGS (10x Chromium)"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="Linked-Read WGS (10x Chromium)"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="Continuous Long Reads WGS"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="Continuous Long Reads WGS"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"] [data-row-key="Circular Consensus Sequencing WGS"] td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"] [data-row-key="Circular Consensus Sequencing WGS"] td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
  });
});
