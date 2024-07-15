/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitParticipantEntity('PT_01236T3G');
});

describe('Page d\'un participant - Valider les redirections', () => {
  it('Studies', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).click({force: true}); // data-cy="SummaryHeader_Studies_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-CDH').should('exist');
  });
  
  it('Biospecimens', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(1).click({force: true}); // data-cy="SummaryHeader_Biospecimens_Button"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
  });
  
  it('Files', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(2).click({force: true}); // data-cy="SummaryHeader_Files_Button"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
  });
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
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains(/^4$/); // data-cy="SummaryHeader_Files_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains('Files'); // data-cy="SummaryHeader_Files_Button"
    cy.get('[id="summary"]').find('[class="ant-collapse-header"]').contains('Summary').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(0).contains('ID').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(0).contains('PT_01236T3G').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(1).contains('Ext. Participant ID').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(1).contains('01-0665').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(2).contains('Study').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(2).contains('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia (KF-CDH)').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(3).contains('dbGaP').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(3).contains('phs001110').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(4).contains('PedcBioPortal').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(4).contains('-').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(5).contains('Family Composition').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(5).contains('Trio').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(5).find('[class*="ant-tag-cyan"]').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(6).contains('Proband').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(6).contains('True').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(6).find('[class*="ant-tag-green"]').should('exist');
  });

  it('Panneau Profile', () => {
    cy.get('[id="profile"]').find('[class*="EntityDescriptions_title"]').contains('Profile').should('exist');
    cy.get('[id="profile"]').find('[class="ant-collapse-header"]').contains('Profile').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-label"]').eq(0).contains('Race').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-content"]').eq(0).contains('White').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-label"]').eq(1).contains('Ethnicity').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-content"]').eq(1).contains('Not Hispanic or Latino').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-label"]').eq(2).contains('Sex').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-content"]').eq(2).contains('Female').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-content"]').eq(2).find('[class*="ant-tag-magenta"]').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-label"]').eq(3).contains('Vital Status').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-content"]').eq(3).contains('Deceased').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-label"]').eq(4).contains('Age at Vital Status').should('exist');
    cy.get('[id="profile"]').find('[class="ant-descriptions-item-content"]').eq(4).contains('-').should('exist');
  });
  
  it('Panneau Family (sans famille)', () => {
    cy.visitParticipantEntity('PT_0YQCPJVV');
    cy.get('[id="family"]').should('not.exist');
  });

  it('Panneau Family (avec famille)', () => {
    cy.resetColumns('family');
    cy.get('[id="family"]').find('[class*="EntityTable_title"]').contains('Family').should('exist');
    cy.get('[id="family"]').find('[class="ant-collapse-header"]').contains('Family').should('exist');
    cy.get('[id="family"]').find('[class="ant-collapse-header"]').contains(' (').should('exist');
    cy.get('[id="family"]').find('[class="ant-collapse-header"]').contains('FM_Z4Y7FP70').should('exist');
    cy.get('[id="family"]').find('[class="ant-collapse-header"]').contains(')').should('exist');
    cy.get('[id="family"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Participant ID').should('exist');
    cy.get('[id="family"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Family Relationship').should('exist');
    cy.get('[data-row-key="PT_01236T3G"]').find('td[class="ant-table-cell"]').eq(0).contains('PT_01236T3G').should('exist');
    cy.get('[data-row-key="PT_01236T3G"]').find('td[class="ant-table-cell"]').eq(1).contains('Proband').should('exist');
    cy.get('[data-row-key="PT_1DYA8779"]').find('td[class="ant-table-cell"]').eq(0).contains('PT_1DYA8779').should('exist');
    cy.get('[data-row-key="PT_1DYA8779"]').find('td[class="ant-table-cell"]').eq(1).contains('Mother').should('exist');
    cy.get('[data-row-key="PT_RZVC67GC"]').find('td[class="ant-table-cell"]').eq(0).contains('PT_RZVC67GC').should('exist');
    cy.get('[data-row-key="PT_RZVC67GC"]').find('td[class="ant-table-cell"]').eq(1).contains('Father').should('exist');
  });
  
  it('Panneau Diagnoses [SKFP-1080]', () => {
    cy.resetColumns('diagnosis');
    cy.get('[id="diagnosis"]').find('[class*="EntityTable_title"]').contains('Diagnosis').should('exist');
    cy.get('[id="diagnosis"]').find('[class="ant-collapse-header"]').contains('Diagnosis').should('exist');
    cy.get('[id="diagnosis"]').find('[class="ant-collapse-header"]').contains('(1)').should('exist');
    cy.get('[id="diagnosis"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Diagnosis (MONDO)').should('exist');
    cy.get('[id="diagnosis"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Diagnosis (NCIT)').should('exist');
    cy.get('[id="diagnosis"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Diagnosis (Source Text)').should('exist');
    cy.get('[id="diagnosis"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Age').should('exist');
    cy.get('[id="diagnosis"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('MONDO Term').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(0).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(0).contains('MONDO:').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(0).contains('0005711').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(1).contains('NCIT:C98893').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(2).contains('congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(4).contains('302').should('exist');
  });
  
  it('Panneau Phenotypes [SKFP-1080]', () => {
    cy.resetColumns('phenotype');
    cy.get('[id="phenotype"]').find('[class*="EntityTable_title"]').contains('Phenotype').should('exist');
    cy.get('[id="phenotype"]').find('[class="ant-collapse-header"]').contains('Phenotype').should('exist');
    cy.get('[id="phenotype"]').find('[class="ant-collapse-header"]').contains('(1)').should('exist');
    cy.get('[id="phenotype"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Phenotype (HPO)').should('exist');
    cy.get('[id="phenotype"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Phenotype (Source Text)').should('exist');
    cy.get('[id="phenotype"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Interpretation').should('exist');
    cy.get('[id="phenotype"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Age').should('exist');
    cy.get('[id="phenotype"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('HPO Term').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(0).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(0).contains('HP').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(0).contains('0000776').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(1).contains('congenital diaphragmatic hernia').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(2).contains('Observed').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(2).find('[class*="ant-tag-green"]').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(4).contains(/\d{1}/).should('exist');
  });
  
  it('Panneau Biospecimens', () => {
    cy.resetColumns('biospecimen');
    cy.showColumn('Anatomical Site (NCIT)');
    cy.showColumn('Anatomical Site (Source Text)');
    cy.showColumn('Tumor Descriptor (Source Text)');
    cy.showColumn('Tumor Location (Source Text)');
    cy.showColumn('Consent Code (dbGaP)');
    cy.showColumn('Consent Type');
    cy.showColumn(/^Volume$/);
    cy.showColumn('Volume Unit');
    cy.showColumn('Sample Availability');
    cy.showColumn('Parent Sample ID');
    cy.showColumn('Parent Sample Type');
    cy.get('[id="biospecimen"]').find('[class*="EntityTable_title"]').contains('Biospecimen').should('exist');
    cy.get('[id="biospecimen"]').find('[class="ant-collapse-header"]').contains('Biospecimen').should('exist');
    cy.get('[id="biospecimen"]').find('[class="ant-collapse-header"]').contains('(1)').should('exist');
    cy.get('[id="biospecimen"]').find('[class="ant-collapse-header"]').contains('View in exploration').should('exist');
    cy.get('[id="biospecimen"]').find('[class="ant-collapse-header"]').find('svg[class="anticon"]').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Sample ID').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Collection ID').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Sample Type').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Collection Sample Type').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Age').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(5).contains('Anatomical Site (NCIT)').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(6).contains('Anatomical Site (Source Text)').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(7).contains('Tumor Descriptor (Source Text)').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(8).contains('Tumor Location (Source Text)').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(9).contains('Consent Code (dbGaP)').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(10).contains('Consent Type').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(11).contains('Volume').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(12).contains('Volume Unit').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(13).contains('Sample Availability').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(14).contains('Parent Sample ID').should('exist');
    cy.get('[id="biospecimen"]').find('thead').find('th[class="ant-table-cell"]').eq(15).contains('Parent Sample Type').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(0).contains('BS_KB0GZCP5').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(1).contains('SA_G25NX8A9').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(2).contains('DNA').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(4).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(5).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(6).contains('Other').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(7).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(8).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(9).contains('phs001110.c1').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(10).contains('GRU').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(11).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(12).contains('-').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(13).contains('No').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(14).contains('SA_G25NX8A9').should('exist');
    cy.get('[data-row-key="BS_KB0GZCP5"]').find('td[class="ant-table-cell"]').eq(15).contains('-').should('exist');
  });
  
  it('Panneau Files [SKFP-1148]', () => {
    cy.get('[id="files"]').find('[class*="EntityTable_title"]').contains('Data File').should('exist');
    cy.get('[id="files"]').find('[class="ant-collapse-header"]').contains('Data File').should('exist');
    cy.get('[id="files"]').find('[class="ant-collapse-header"]').contains('(4)').should('exist');
    cy.get('[id="files"]').find('[class="ant-collapse-header"]').contains('View in exploration').should('exist');
    cy.get('[id="files"]').find('[class="ant-collapse-header"]').find('svg[class="anticon"]').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_subTitle"]').eq(0).contains('File counts by Data Category').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_contentTable"]').eq(0).find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Data Category').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_contentTable"]').eq(0).find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Files').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_contentTable"]').eq(0).find('thead').find('th[class="ant-table-cell"]').eq(2).contains('(n=4)').should('exist');
    cy.get('[id="files"]').find('[data-row-key="Genomics"]').find('td[class="ant-table-cell"]').eq(1).contains(/^4$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="Genomics"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 100%"]').should('exist');
    cy.get('[id="files"]').find('[data-row-key="Transcriptomics"]').find('td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="Transcriptomics"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');

    cy.get('[id="files"]').find('[class*="EntityTable_subTitle"]').eq(1).contains('File counts by Experimental Strategy').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_contentTable"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Experimental Strategy').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_contentTable"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Files').should('exist');
    cy.get('[id="files"]').find('[class*="EntityTable_contentTable"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(2).contains('(n=4)').should('exist');
    cy.get('[id="files"]').find('[data-row-key="WGS"]').find('td[class="ant-table-cell"]').eq(1).contains(/^4$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="WGS"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 100%"]').should('exist');
    cy.get('[id="files"]').find('[data-row-key="RNA-Seq"]').find('td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="RNA-Seq"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"]').find('[data-row-key="Whole Genome Sequencing"]').find('td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="Whole Genome Sequencing"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"]').find('[data-row-key="WXS"]').find('td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="WXS"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"]').find('[data-row-key="Whole Exome Sequencing"]').find('td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="Whole Exome Sequencing"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
    cy.get('[id="files"]').find('[data-row-key="Linked-Read WGS (10x Chromium)"]').find('td[class="ant-table-cell"]').eq(1).contains(/^0$/).should('exist');
    cy.get('[id="files"]').find('[data-row-key="Linked-Read WGS (10x Chromium)"]').find('td[class="ant-table-cell"]').eq(2).find('[style*="width: 0%"]').should('exist');
  });
});

describe('Page d\'un participant - Valider les liens disponibles', () => {
  it('Lien dbGaP du panneau Summary', () => {
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(3).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001110');
  });

  it('Lien Family du panneau Family', () => {
    cy.resetColumns('family');
    cy.get('[id="family"]').find('[class="ant-collapse-header"]').find('[href]').click({force: true}); // data-cy="FamilyLink"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Family ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('FM Z4Y7FP70').should('exist');
  });

  it('Lien Mother du panneau Family', () => {
    cy.resetColumns('family');
    cy.get('[data-row-key="PT_1DYA8779"]').find('td[class="ant-table-cell"]').eq(0).find('[href]').click({force: true});
    cy.get('[class*="EntityTitle"]').contains('PT_1DYA8779');
  });

  it('Lien Mondo du panneau Diagnoses', () => {
    cy.resetColumns('diagnosis');
    cy.get('[id="diagnosis"]').find('td[class="ant-table-cell"]').eq(0).find('[href]')
      .should('have.attr', 'href', 'http://purl.obolibrary.org/obo/MONDO_0005711');
  });

  it('Lien NCIT du panneau Diagnoses', () => {
    cy.resetColumns('diagnosis');
    cy.get('[id="diagnosis"]').find('td[class="ant-table-cell"]').eq(1).find('[href]')
      .should('have.attr', 'href', 'http://purl.obolibrary.org/obo/NCIT_C98893');
  });

  it('Lien MONDO Term du panneau Diagnoses', () => {
    cy.resetColumns('diagnosis');
    cy.get('[data-row-key="DG_92Q0Z7RA"]').find('td[class="ant-table-cell"]').eq(4).find('[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Diagnosis (MONDO)').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Congenital diaphragmatic hernia (MONDO:0005711)').should('exist');
    cy.validateTableResultsCount(/^302$/);
  });

  it('Lien HP du panneau Phenotypes', () => {
    cy.resetColumns('phenotype');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(0).find('[href]')
      .should('have.attr', 'href', 'http://purl.obolibrary.org/obo/HP_0000776');
  });

  it('Lien HPO Term du panneau Phenotypes', () => {
    cy.resetColumns('phenotype');
    cy.get('[data-row-key="cn-c6ezqjr5"]').find('td[class="ant-table-cell"]').eq(4).find('[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Phenotype (HPO)').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Congenital diaphragmatic hernia (HP:0000776)').should('exist');
    cy.validateTableResultsCount(/\d{1}/);
  });

  it('Lien DataExploration du panneau Biospecimens', () => {
    cy.resetColumns('biospecimen');
    cy.get('[id="biospecimen"] [class="ant-collapse-header"] button').click({force: true}); // data-cy="Biospecimens_RedirectLink"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
  });

  it('Lien Collection ID du panneau Biospecimens', () => {
    cy.resetColumns('biospecimen');
    cy.get('[id="biospecimen"]').find('td[class="ant-table-cell"]').eq(1).find('[href]').click({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Collection ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('SA G25NX8A9').should('exist');
  });

  it('Lien DataExploration du panneau Files', () => {
    cy.get('[id="files"] [class="ant-collapse-header"] button').click({force: true}); // data-cy="Files_RedirectLink"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
  });

  it('Lien Files de Genomics du panneau Files', () => {
    cy.get('[id="files"]').find('[data-row-key="Genomics"]').find('td[class="ant-table-cell"]').eq(1).find('[href]').click({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Data Category').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Genomics').should('exist');
  });

  it('Lien Files de WGS du panneau Files', () => {
    cy.get('[id="files"]').find('[data-row-key="WGS"]').find('td[class="ant-table-cell"]').eq(1).find('[href]').click({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Experimental Strategy').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('WGS').should('exist');
  });
});

describe('Page d\'un participant - Valider les panneaux masquables', () => {
  it('Panneau Summary', () => {
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="summary"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="summary"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Profile', () => {
    cy.get('[id="profile"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="profile"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="profile"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="profile"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="profile"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Family', () => {
    cy.get('[id="family"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="family"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="family"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="family"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="family"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Diagnoses', () => {
    cy.get('[id="diagnosis"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="diagnosis"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="diagnosis"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="diagnosis"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="diagnosis"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Phenotypes', () => {
    cy.get('[id="phenotype"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="phenotype"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="phenotype"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="phenotype"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="phenotype"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Biospecimens', () => {
    cy.get('[id="biospecimen"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="biospecimen"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="biospecimen"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="biospecimen"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="biospecimen"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Files', () => {
    cy.get('[id="files"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="files"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="files"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="files"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="files"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });
});
