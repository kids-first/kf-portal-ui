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

describe('Page Data Exploration (Participants) - Valider les liens disponibles', () => {
  it('Lien Participant du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(1).find('[href]').clickAndWait({force: true});
    cy.get('[id="participant-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('PT_01236T3G');
  });

  it('Lien dbGap du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(3).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001110');
  });

  it('Lien Mondo de Diagnosis (MONDO) du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(6).find('[href]')
      .should('have.attr', 'href', 'http://purl.obolibrary.org/obo/MONDO_0005711');
  });

  it('Lien HP de Phenotype (HPO) du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(7).find('[href]')
    .should('have.attr', 'href', 'http://purl.obolibrary.org/obo/HP_0000776');
  });

  it('Lien Biospecimens du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(11).find('[href]').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.validateTableResultsCount(/^1$/);
  });

  it('Lien Files du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(12).find('[href]').clickAndWait({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.validateTableResultsCount(/\d{1}/);
  });

  it('Lien Diagnosis (NCIT) du tableau', () => {
    cy.get('tr[data-row-key="PT_01236T3G"] [class*="ant-table-cell"]').eq(16).find('[href]')
      .should('have.attr', 'href', 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=22.07d&ns=ncit&code=C98893');
  });
});
