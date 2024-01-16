/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Biospecimens) - Vérifier les informations affichées', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens', '?sharedFilterId=c70ff0ec-e96d-4176-809c-2b744236fcf5');
    cy.showColumn('Anatomical Site (NCIT)');
    cy.showColumn('Anatomical Site (Source Text)');
    cy.showColumn('Histological Diagnosis (NCIT)');
    cy.showColumn('Histological Diagnosis (Source Text)');
    cy.showColumn('Tumor Location (Source Text)');
    cy.showColumn('Consent Code (dbGaP)');
    cy.showColumn('Consent Type');
    cy.showColumn('Method of Sample Procurement');
    cy.showColumn('Tumor Descriptor (Source Text)');
    cy.showColumn(/^Volume$/);
    cy.showColumn('Volume Unit');
    cy.showColumn('External Participant ID');
    cy.showColumn('External Sample ID');
  });

  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(1).contains('BS_0ZQ4019R').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(2).contains('PBTA-PNOC').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(3).contains('DNA').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(4).contains('BS_0ZQ4019R_Peripheral_Whole_Blood').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(5).contains('Peripheral Whole Blood').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(6).contains('PT_M8MDJNZB').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(7).contains('BS_0ZQ4019R_Peripheral_Whole_Blood').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(8).contains('Peripheral Whole Blood').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(9).contains('9').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(9).contains('years').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(9).contains('88').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(9).contains('days').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(10).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(11).contains('No').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(12).contains(/^1$/).should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(13).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(14).contains('Not Applicable').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(15).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(16).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(17).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(18).contains('Not Reported').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(19).contains('Not Reported').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(20).contains('Not Reported').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(21).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(22).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(23).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(24).contains('C3505746').should('exist');
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(25).contains('1116087').should('exist');
  });
});

describe('Page Data Exploration (Biospecimens) - Valider les liens disponibles', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens', '?sharedFilterId=c70ff0ec-e96d-4176-809c-2b744236fcf5');
    cy.showColumn('Anatomical Site (NCIT)');
    cy.showColumn('Anatomical Site (Source Text)');
    cy.showColumn('Histological Diagnosis (NCIT)');
    cy.showColumn('Histological Diagnosis (Source Text)');
    cy.showColumn('Tumor Location (Source Text)');
    cy.showColumn('Consent Code (dbGaP)');
    cy.showColumn('Consent Type');
    cy.showColumn('Method of Sample Procurement');
    cy.showColumn('Tumor Descriptor (Source Text)');
    cy.showColumn(/^Volume$/);
    cy.showColumn('Volume Unit');
    cy.showColumn('External Participant ID');
    cy.showColumn('External Sample ID');
  });

  it('Lien Participant ID du tableau', () => {
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(6).find('[href]').click({force: true});
    cy.get('[id="participant-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('PT_M8MDJNZB');
  });

  it('Lien Collection ID du tableau', () => {
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(7).find('[href]').click({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.validatePillSelectedQuery('Collection ID', ['BS 0ZQ4019R Peripheral Whole Blood']);
  });

  it('Lien Files du tableau', () => {
    cy.get('tr[class*="ant-table-row"]').find('[class*="ant-table-cell"]').eq(12).find('[href]').click({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Sample ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('BS 0ZQ4019R').should('exist');
    cy.validateTableResultsCount(/^1$/);
  });
});

describe('Page Data Exploration (Biospecimens) - Valider les fonctionnalités du tableau', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens');
    cy.showColumn('Anatomical Site (NCIT)');
    cy.showColumn('Anatomical Site (Source Text)');
    cy.showColumn('Histological Diagnosis (NCIT)');
    cy.showColumn('Histological Diagnosis (Source Text)');
    cy.showColumn('Tumor Location (Source Text)');
    cy.showColumn('Consent Code (dbGaP)');
    cy.showColumn('Consent Type');
    cy.showColumn('Method of Sample Procurement');
    cy.showColumn('Tumor Descriptor (Source Text)');
    cy.showColumn(/^Volume$/);
    cy.showColumn('Volume Unit');
    cy.showColumn('External Participant ID');
    cy.showColumn('External Sample ID');
  });

  it('Valider les fonctionnalités du tableau - Tri Sample ID', () => {
    cy.sortTableAndWait('Sample ID');
    cy.validateTableFirstRow('BS_003293HH', 1);
    cy.sortTableAndIntercept('Sample ID', 1);
    cy.validateTableFirstRow('BS_ZZZSE8CC', 1);
  });

  it('Valider les fonctionnalités du tableau - Tri Study', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow('KF-CDH', 2);
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow('PBTA-PNOC', 2);
  });

  it('Valider les fonctionnalités du tableau - Tri Sample Type', () => {
    cy.sortTableAndIntercept('Sample Type', 1);
    cy.validateTableFirstRow('-', 3);
    cy.sortTableAndIntercept('Sample Type', 1);
    cy.validateTableFirstRow('RNA', 3);
  });

  it('Valider les fonctionnalités du tableau - Tri Parent Sample ID', () => {
    cy.sortTableAndIntercept('Parent Sample ID', 1);
    cy.validateTableFirstRow('BS_003293HH_Peripheral_Whole_Blood', 4);
    cy.sortTableAndIntercept('Parent Sample ID', 1);
    cy.validateTableFirstRow('BS_ZZZSE8CC_Buccal_Cells', 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Parent Sample Type', () => {
    cy.sortTableAndIntercept('Parent Sample Type', 1);
    cy.validateTableFirstRow('-', 5);
    cy.sortTableAndIntercept('Parent Sample Type', 1);
    cy.validateTableFirstRow('Saliva', 5);
  });

  it('Valider les fonctionnalités du tableau - Tri Participant ID', () => {
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow('PT_0001K4K1', 6);
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow('PT_ZZYTGPQS', 6);
  });

  it('Valider les fonctionnalités du tableau - Tri Files', () => {
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow(/^0$/, 12);
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow('48', 12);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow('PT_004FDKPF', 6);
  });

  it('Valider les fonctionnalités du tableau - Pagination', () => {
    cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
    cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('20').click({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('be.disabled');

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('body').find('button[type="button"]').contains('Next').click({force: true});
    cy.wait('@getPOSTgraphql1', {timeout: 20*1000});
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql2');
    cy.get('body').find('button[type="button"]').contains('Next').click({force: true});
    cy.wait('@getPOSTgraphql2', {timeout: 20*1000});
    cy.get('div[class*="ProTableHeader"]').contains(/^41$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^60$/).should('exist');
    cy.get('body').find('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('body').find('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql3');
    cy.get('body').find('button[type="button"]').contains('Prev.').click({force: true});
    cy.wait('@getPOSTgraphql3', {timeout: 20*1000});
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
  