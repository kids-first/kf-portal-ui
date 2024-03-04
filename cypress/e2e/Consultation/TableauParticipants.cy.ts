/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Participants) - Vérifier les informations affichées', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
    cy.showColumn('Race');
    cy.showColumn('Ethnicity');
    cy.showColumn('External Participant ID');
    cy.showColumn('Diagnosis (NCIT)');
    cy.showColumn('Diagnosis (Source Text)');
    cy.showColumn('Vital Status');
    cy.showColumn('Not Observed Phenotype (HPO)');
    cy.showColumn('Observed Phenotype (Source Text)');
  });

  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(1).contains('PT_01236T3G').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(2).contains('KF-CDH').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(3).contains('phs001110').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(4).contains('True').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(5).contains('Female').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(5).find('[class*="ColorTag_genderFemale"]').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(6).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(6).contains('MONDO:').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(6).contains('0005711').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(7).contains('Congenital diaphragmatic hernia').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(7).contains('HP:').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(7).contains('0000776').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(8).contains('FM_Z4Y7FP70').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(9).contains('Trio').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(9).find('[class*="ant-tag-cyan"]').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(10).contains('-').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(11).contains(/^1$/).should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(12).contains(/^7$/).should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(13).contains('White').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(14).contains('Not Hispanic or Latino').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(15).contains('01-0665').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(16).contains('NCIT:C98893').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(17).contains('congential diaphragmatic hernia').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(18).contains('Deceased').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(19).contains('-').should('exist');
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(20).contains('Congenital diaphragmatic hernia').should('exist');
  });
});

describe('Page Data Exploration (Participants) - Valider les liens disponibles', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
    cy.showColumn('Race');
    cy.showColumn('Ethnicity');
    cy.showColumn('External Participant ID');
    cy.showColumn('Diagnosis (NCIT)');
    cy.showColumn('Diagnosis (Source Text)');
    cy.showColumn('Vital Status');
    cy.showColumn('Not Observed Phenotype (HPO)');
    cy.showColumn('Observed Phenotype (Source Text)');
  });

  it('Lien Participant du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(1).find('[href]').click({force: true});
    cy.get('[id="participant-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('PT_01236T3G');
  });

  // Ne fonctionne pas pour une raison inconnue
  it.skip('Lien dbGap du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class="ant-table-cell"]').eq(3).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001110');
  });

  it('Lien Mondo de Diagnosis (MONDO) du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(6).find('[href]')
      .should('have.attr', 'href', 'https://monarchinitiative.org/disease/MONDO:0005711');
  });

  it('Lien HP de Phenotype (HPO) du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(7).find('[href]')
    .should('have.attr', 'href', 'https://hpo.jax.org/app/browse/term/HP:0000776');
  });

  it('Lien Biospecimens du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(11).find('[href]').click({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.validateTableResultsCount(/^1$/);
  });

  it('Lien Files du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(12).find('[href]').click({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.validateTableResultsCount(/^7$/);
  });

  it('Lien Diagnosis (NCIT) du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"]').find('[class*="ant-table-cell"]').eq(16).find('[href]')
      .should('have.attr', 'href', 'http://purl.obolibrary.org/obo/NCIT_C98893');
  });
});

describe('Page Data Exploration (Participants) - Valider les fonctionnalités du tableau', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants');
    cy.showColumn('Race');
    cy.showColumn('Ethnicity');
    cy.showColumn('External Participant ID');
    cy.showColumn('Diagnosis (NCIT)');
    cy.showColumn('Diagnosis (Source Text)');
    cy.showColumn('Vital Status');
    cy.showColumn('Not Observed Phenotype (HPO)');
    cy.showColumn('Observed Phenotype (Source Text)');
  });

  it('Valider les fonctionnalités du tableau - Tri Participant ID', () => {
    cy.sortTableAndWait('Participant ID');
    cy.validateTableFirstRow('PT_0001K4K1', 1);
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow('PT_ZZYTGPQS', 1);
  });

  it('Valider les fonctionnalités du tableau - Tri Study', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow('KF-CDH', 2);
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow('PBTA-PNOC', 2);
  });

  it('Valider les fonctionnalités du tableau - Tri Proband', () => {
    cy.sortTableAndIntercept('Proband', 1);
    cy.validateTableFirstRow('False', 4);
    cy.sortTableAndIntercept('Proband', 1);
    cy.validateTableFirstRow('True', 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Sex [SKFP-773]', () => {
    cy.sortTableAndIntercept('Sex', 1);
    cy.validateTableFirstRow('Female', 5);
    cy.sortTableAndIntercept('Sex', 1);
    cy.validateTableFirstRow('Unknown', 5);
  });

  it('Valider les fonctionnalités du tableau - Tri Family ID', () => {
    cy.sortTableAndIntercept('Family ID', 1);
    cy.validateTableFirstRow('-', 8);
    cy.sortTableAndIntercept('Family ID', 1);
    cy.validateTableFirstRow('FM_ZZZ7MEPS', 8);
  });

  it('Valider les fonctionnalités du tableau - Tri Family Composition', () => {
    cy.sortTableAndIntercept('Family Composition', 1);
    cy.validateTableFirstRow('-', 9);
    cy.sortTableAndIntercept('Family Composition', 1);
    cy.validateTableFirstRow('Trio+', 9);
  });

  it('Valider les fonctionnalités du tableau - Tri PedcBioPortal [SKFP-942]', () => {
    cy.sortTableAndIntercept('PedcBioPortal', 1);
    cy.validateTableFirstRow('-', 10);
    cy.sortTableAndIntercept('PedcBioPortal', 1);
    cy.validateTableFirstRow('PT_06Z51EN5', 10);
  });

  it('Valider les fonctionnalités du tableau - Tri Biospecimens', () => {
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow(/^0$/, 11);
    cy.sortTableAndIntercept('Biospecimens', 1);
    cy.validateTableFirstRow('17', 11);
  });

  it('Valider les fonctionnalités du tableau - Tri Files [SKFP-773]', () => {
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow(/^0$/, 12);
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow('39', 12);
  });

  it('Valider les fonctionnalités du tableau - Tri Race [SKFP-773]', () => {
    cy.sortTableAndIntercept('Race', 1);
    cy.validateTableFirstRow('-', 13);
    cy.sortTableAndIntercept('Race', 1);
    cy.validateTableFirstRow('Unknown', 13);
  });

  it('Valider les fonctionnalités du tableau - Tri Ethnicity [SKFP-773]', () => {
    cy.sortTableAndIntercept('Ethnicity', 1);
    cy.validateTableFirstRow('-', 14);
    cy.sortTableAndIntercept('Ethnicity', 1);
    cy.validateTableFirstRow('Unknown', 14);
  });

  it('Valider les fonctionnalités du tableau - Tri External Participant ID [SKFP-773]', () => {
    cy.sortTableAndIntercept('External Participant ID', 1);
    cy.validateTableFirstRow('BASIC3-1012594502', 15);
    cy.sortTableAndIntercept('External Participant ID', 1);
    cy.validateTableFirstRow('PAWGRK_T_Mismatch', 15);
  });

  it('Valider les fonctionnalités du tableau - Tri Diagnosis (NCIT) [SKFP-773]', () => {
    cy.sortTableAndIntercept('Diagnosis (NCIT)', 1);
    cy.validateTableFirstRow('-', 16);
    cy.sortTableAndIntercept('Diagnosis (NCIT)', 1);
    cy.validateTableFirstRow('NCIT:C9325', 16);
  });

  it('Valider les fonctionnalités du tableau - Tri Vital Status [SKFP-773]', () => {
    cy.sortTableAndIntercept('Vital Status', 1);
    cy.validateTableFirstRow('Alive', 18);
    cy.sortTableAndIntercept('Vital Status', 1);
    cy.validateTableFirstRow('Reported Unknown', 18);
  });

  it('Valider les fonctionnalités du tableau - Tri Not Observed Phenotype (HPO) [SKFP-942]', () => {
    cy.sortTableAndIntercept('Not Observed Phenotype (HPO)', 1);
    cy.validateTableFirstRow('-', 19);
    cy.sortTableAndIntercept('Not Observed Phenotype (HPO)', 1);
    cy.validateTableFirstRow('Webbed neck (HP:0000465)', 19);
  });

  it('Valider les fonctionnalités du tableau - Tri Observed Phenotype (Source Text) [SKFP-942]', () => {
    cy.sortTableAndIntercept('Observed Phenotype (Source Text)', 1);
    cy.validateTableFirstRow('-', 20);
    cy.sortTableAndIntercept('Observed Phenotype (Source Text)', 1);
    cy.validateTableFirstRow('Tetralogy of Fallot', 20);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple [SKFP-773]', () => {
    cy.sortTableAndIntercept('Sex', 1);
    cy.sortTableAndWait('Participant ID');
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow('PT_ZZR4MJPH', 1);
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
  