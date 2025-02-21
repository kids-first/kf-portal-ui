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

describe('Page Data Exploration (Biospecimens) - Valider les liens disponibles', () => {
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
