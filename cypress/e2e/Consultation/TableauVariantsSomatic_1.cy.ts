/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsSomaticPage('?sharedFilterId=5ac35019-b8b4-43ac-947b-bf64ffe054a5');
  cy.showColumn(/^gnomAD$/);
  cy.showColumn('gnomAD ALT');
  cy.showColumn('CADD');
  cy.showColumn('REVEL');
  cy.showColumn(/^ALT$/);
  cy.showColumn('Homo.');
});

describe('Page des variants (Somatic) - Consultation du tableau', () => {
  it('Vérifier les informations affichées', () => {
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(1).contains('chr2:g.240757426C>A').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(2).contains('SNV').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(3).find('[class*="anticon"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(4).contains('KIF1A').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(5).find('[class*="moderateImpact"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(5).contains('Missense').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(5).contains('p.Glu917Asp').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(6).find('path[d*="M12.1872"]').should('exist'); // C
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(6).find('path[d*="0C5.37258"]').should('exist'); // M
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(7).contains('AD').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(7).contains('AR').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(7).find('[class*="ant-tag-blue"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(8).find('[class*="hotspotFalse"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(9).contains('10').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(9).contains('2.29e-4').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(10).contains('Tier 3').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(10).find('[class*="ant-tag-orange"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(11).contains(/^VUS$/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(11).find('[class*="ant-tag-orange"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(12).contains('-').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(13).contains('-').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(14).contains(/^1$/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(15).contains(/^1$/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(15).contains('2.98e-3').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(16).contains('10.85').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(17).contains('0.091').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(18).contains(/^1$/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(19).contains(/^0$/).should('exist');
  });
 
  it('Valider l\'icône de sauvegarde des requêtes personnalisées', () => {
    cy.get('[data-cy="SidebarMenuItem_Variant"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist');
    cy.checkValueFacetAndApply('Variant Type', 'SNV');
    cy.get('[class*="QueryBar_selected"] [class*="anticon-save"]').should('not.exist');
  });
 
  it('Valider les liens disponibles Lien Variant', () => {
    cy.get('tr[data-row-key]').eq(0).contains('chr2:g.240757426C>A').clickAndWait({force: true});
    cy.get('[class*="EntityTitle"]').contains('chr2:g.240757426C>A');
  });
 
  it('Valider les liens disponibles Lien dbSNP', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(3).find('a[href]')
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/snp/rs537608637');
  });
 
  it('Valider les liens disponibles Lien Gene', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(4).find('a[href]')
    .should('have.attr', 'href', 'https://www.omim.org/entry/601255');
  });
 
  it('Valider les liens disponibles Lien Gene Plus', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(4).find('[data-icon="plus"]').clickAndWait({force: true});
    cy.validatePillSelectedQuery('Genes Symbol', ['KIF1A']);
  });
 
  it('Valider les liens disponibles Lien OMIM', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(7).find('a[href]')
      .should('have.attr', 'href', 'https://www.omim.org/entry/601255');
  });
 
  it('Valider les liens disponibles Lien CMC', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(9).find('a[href]')
      .should('have.attr', 'href', 'https://cancer.sanger.ac.uk/cosmic/mutation/overview?id=69562221&genome=37');
  });
 
  it('Valider les liens disponibles Lien ClinVar', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(11).find('a[href]').eq(0)
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/1801032');
  });
 
  it('Valider les liens disponibles Lien Studies', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(14).find('a[href]').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('KF-NBL').should('exist');
  });
 
  it('Valider les liens disponibles Lien Part.', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(15).find('a[href]').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT').should('exist');
  });
});
