/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Data Files) - Vérifier les informations affichées', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
    cy.showColumn('File Name');
    cy.showColumn('Platform');
    cy.showColumn('Repository');
    cy.showColumn('ACL');
    cy.showColumn('Access URL');
  });

  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(1).find('svg[data-icon="lock"]').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(2).contains('C').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(2).find('[class*="ant-tag-geekblue"]').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(3).contains('GF_6DVS70V9').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(4).contains('KF-CDH').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(5).contains('Genomics').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(6).contains('Simple Nucleotide Variations').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(7).contains('WGS').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(8).contains(/^vcf$/).should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(9).contains('3.04 GB').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(10).contains(/^3$/).should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(11).contains(/^3$/).should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(12).contains('2882b453-28b8-4238-bf7a-c4e0ff015a28.multi.vqsr.filtered.denovo.vep_105.vcf.gz').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(13).contains('Not Reported').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(14).contains('Gen3').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(15).contains('phs001110.c1').should('exist');
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(16).contains('drs://data.kidsfirstdrc.org/37cdb370-cda3-4504-be1b-f59cf6f785de').should('exist');
  });
});

describe('Page Data Exploration (Data Files) - Valider les liens disponibles', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
    cy.showColumn('File Name');
    cy.showColumn('Platform');
    cy.showColumn('Repository');
    cy.showColumn('ACL');
    cy.showColumn('Access URL');
  });

  it('Lien File ID du tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(3).find('[href]').click({force: true});
    cy.get('[id="file-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('GF_6DVS70V9');
  });

  it('Lien Participants du tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(10).find('[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
    cy.validateTableResultsCount(/^3$/);
  });

  it('Lien Biospecimens du tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"]').find('[class*="ant-table-cell"]').eq(11).find('[href]').click({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
    cy.validateTableResultsCount(/^3$/);
  });
});

describe('Page Data Exploration (Data Files) - Valider les fonctionnalités du tableau', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles');
    cy.showColumn('File Name');
    cy.showColumn('Platform');
    cy.showColumn('Repository');
    cy.showColumn('ACL');
    cy.showColumn('Access URL');
  });

  it('Valider les fonctionnalités du tableau - Tri File ID', () => {
    cy.sortTableAndWait('File ID',);
    cy.validateTableFirstRow('GF_0003WJQG', 3, true);
    cy.sortTableAndIntercept('File ID', 1);
    cy.validateTableFirstRow('GF_ZZZYCMZQ', 3, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Study', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4, true);
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow('KF-TALL', 4, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Data Category', () => {
    cy.sortTableAndIntercept('Data Category', 1);
    cy.validateTableFirstRow('-', 5, true);
    cy.sortTableAndIntercept('Data Category', 1);
    cy.validateTableFirstRow('Transcriptomics', 5, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Data Type', () => {
    cy.sortTableAndIntercept('Data Type', 1);
    cy.validateTableFirstRow('-', 6, true);
    cy.sortTableAndIntercept('Data Type', 1);
    cy.validateTableFirstRow('gVCF', 6, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Experimental Strategy', () => {
    cy.sortTableAndIntercept('Experimental Strategy', 1);
    cy.validateTableFirstRow('-', 7, true);
    cy.sortTableAndIntercept('Experimental Strategy', 1);
    cy.validateTableFirstRow('Whole Genome Sequencing', 7, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Format', () => {
    cy.sortTableAndIntercept('Format', 1);
    cy.validateTableFirstRow('bam', 8, true);
    cy.sortTableAndIntercept('Format', 1);
    cy.validateTableFirstRow('vcf', 8, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Size', () => {
    cy.sortTableAndIntercept('Size', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 9, true);
    cy.sortTableAndIntercept('Size', 1);
    cy.validateTableFirstRow('572.08 GB', 9, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Participants', () => {
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/^1$/, 10, true);
    cy.sortTableAndIntercept('Participants', 1);
    cy.validateTableFirstRow(/^8$/, 10, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/^1$/, 11, true);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/^8$/, 11, true);
  });

  it('Valider les fonctionnalités du tableau - Tri File Name', () => {
    cy.sortTableAndIntercept('File Name', 1);
    cy.validateTableFirstRow('0000e2ec-a59e-42aa-a312-85f1952779bc.CGP.filtered.deNovo.vep.vcf.gz', 12, true);
    cy.sortTableAndIntercept('File Name', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 12, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Platform', () => {
    cy.sortTableAndIntercept('Platform', 1);
    cy.validateTableFirstRow('-', 13, true);
    cy.sortTableAndIntercept('Platform', 1);
    cy.validateTableFirstRow('Not Reported', 13, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Repository', () => {
    cy.sortTableAndIntercept('Repository', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 14, true);
    cy.sortTableAndIntercept('Repository', 1);
    cy.validateTableFirstRow('Gen3', 14, true);
  });

  it('Valider les fonctionnalités du tableau - Tri ACL', () => {
    cy.sortTableAndIntercept('ACL', 1);
    cy.validateTableFirstRow('-', 15, true);
    cy.sortTableAndIntercept('ACL', 1);
    cy.validateTableFirstRow('phs002627.c1, phs002627.c999, SD_1NNS3K8V', 15, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Access URL', () => {
    cy.sortTableAndIntercept('Access URL', 1);
    cy.validateTableFirstRow('drs://data.kidsfirstdrc.org/00000eae-7f56-4a89-854e-6e88c0683340', 16, true);
    cy.sortTableAndIntercept('Access URL', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 16, true);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndWait('Format');
    cy.sortTableAndWait('Size');
    cy.validateTableFirstRow(/^(?!-).*$/, 9, true);
  });

  it('Valider les fonctionnalités du tableau - Pagination', () => {
    cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
    cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('20').click({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('be.disabled');

    cy.get('body').find('button[type="button"]').contains('Next').click({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('body').find('button[type="button"]').contains('Next').click({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^41$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^60$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('body').find('button[type="button"]').contains('Prev.').click({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('body').find('button[type="button"]').contains('First').click({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('be.disabled');
  });
});
  