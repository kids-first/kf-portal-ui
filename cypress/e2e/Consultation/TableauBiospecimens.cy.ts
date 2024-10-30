/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Biospecimens) - Vérifier les informations affichées', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
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

  it('Titre', () => {
    cy.get('[class*="PageContent_title"]').contains('Data Exploration'); // data-cy="Title_DataExploration"
  });

  it('Tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(1).contains('BS_KB0GZCP5').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(2).contains('KF-CDH').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(3).contains('DNA').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(4).contains('SA_G25NX8A9').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(5).contains('Leukocyte').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(6).contains('PT_01236T3G').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(7).contains('SA_G25NX8A9').should('exist');
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
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(22).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(23).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(24).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(25).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(26).contains('-').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(27).contains('01-0665').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(28).contains('01-0665').should('exist');
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(29).contains('-').should('exist');
  });
});

describe('Page Data Exploration (Biospecimens) - Valider les liens disponibles', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens', '?sharedFilterId=c80e4b42-a3e3-4525-a425-933b44eafef9');
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

  it('Lien Participant ID du tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(6).find('[href]').clickAndWait({force: true});
    cy.get('[id="participant-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('PT_01236T3G');
  });

  it('Lien Collection ID du tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(7).find('[href]').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.validatePillSelectedQuery('Collection ID', ['SA G25NX8A9']);
  });

  it('Lien Files du tableau', () => {
    cy.get('tr[class*="ant-table-row"] [class*="ant-table-cell"]').eq(13).find('[href]').clickAndWait({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Sample ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('BS KB0GZCP5').should('exist');
    cy.validateTableResultsCount(/\d{1}/);
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
    cy.showColumn('Preservation Method');
    cy.showColumn('Method of Sample Procurement');
    cy.showColumn('Tumor Descriptor (Source Text)');
    cy.showColumn('Paired Normal Sample');
    cy.showColumn(/^Volume$/);
    cy.showColumn('Volume Unit');
    cy.showColumn('External Participant ID');
    cy.showColumn('External Sample ID');
    cy.showColumn('External Collection ID');
  });

  it('Valider les fonctionnalités du tableau - Tri Sample ID', () => {
    cy.sortTableAndWait('Sample ID');
    cy.validateTableFirstRow(/^(?!-).*$/, 1, true);
    cy.sortTableAndIntercept('Sample ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 1, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Study', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 2, true);
    cy.sortTableAndIntercept('Study', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 2, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Sample Type', () => {
    cy.sortTableAndIntercept('Sample Type', 1);
    cy.validateTableFirstRow('-', 3, true);
    cy.sortTableAndIntercept('Sample Type', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 3, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Parent Sample ID', () => {
    cy.sortTableAndIntercept('Parent Sample ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4, true);
    cy.sortTableAndIntercept('Parent Sample ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 4, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Parent Sample Type', () => {
    cy.sortTableAndIntercept('Parent Sample Type', 1);
    cy.validateTableFirstRow('-', 5, true);
    cy.sortTableAndIntercept('Parent Sample Type', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 5, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Participant ID', () => {
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 6, true);
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 6, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Files', () => {
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow(/^0$/, 13, true);
    cy.sortTableAndIntercept('Files', 1);
    cy.validateTableFirstRow(/\d{1}/, 13, true);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('Study', 1);
    cy.sortTableAndIntercept('Participant ID', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 6, true);
  });

  it('Valider les fonctionnalités du tableau - Pagination', () => {
    cy.get('span[class*="ant-select-selection-item"]').clickAndWait({force: true});
    cy.get('div[class*="ant-select-item-option-content"]').contains('20').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('be.disabled');

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('button[type="button"]').contains('Next').clickAndWait({force: true});
    cy.wait('@getPOSTgraphql1');
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql2');
    cy.get('button[type="button"]').contains('Next').clickAndWait({force: true});
    cy.wait('@getPOSTgraphql2');
    cy.get('div[class*="ProTableHeader"]').contains(/^41$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^60$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql3');
    cy.get('button[type="button"]').contains('Prev.').clickAndWait({force: true});
    cy.wait('@getPOSTgraphql3');
    cy.get('div[class*="ProTableHeader"]').contains(/^21$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^40$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('not.be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

    cy.get('button[type="button"]').contains('First').clickAndWait({force: true});
    cy.get('div[class*="ProTableHeader"]').contains(/^1$/).should('exist');
    cy.get('div[class*="ProTableHeader"]').contains(/^20$/).should('exist');
    cy.get('button[type="button"]').contains('Prev.').parent('button').should('be.disabled');
    cy.get('button[type="button"]').contains('First').parent('button').should('be.disabled');
  });
});
  