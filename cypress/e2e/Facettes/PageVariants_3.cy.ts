/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
  cy.get('[data-cy="SidebarMenuItem_Variant"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
});

describe('Page des variants (Variant) - Filtrer avec les facettes', () => {
  it('Variant Type - SNV', () => {
    cy.validateFacetFilter('Variant Type', 'SNV', 'SNV', /^9,985,395$/, 1);
    cy.validateFacetRank(0, 'Variant Type');
  });

  it('Consequence - Intron', () => {
    cy.validateFacetFilter('Consequence', 'Intron', 'intron', /^7,950,262$/, 1);
    cy.validateFacetRank(1, 'Consequence');
  });

  it('Consequence - Missense', () => {
    cy.validateFacetFilter('Consequence', 'Missense', 'missense', /^39,466$/, 1);
  });

  it('Variant External Reference - DbSNP', () => {
    cy.validateFacetFilter('Variant External Reference', 'DbSNP', 'DBSNP', /^11,283,818$/, 1);
    cy.validateFacetRank(2, 'Variant External Reference');
  });

  it('Chromosome - 1', () => {
    cy.validateFacetFilter('Chromosome', '1', '1', /^2,503,111$/, 1);
    cy.validateFacetRank(3, 'Chromosome');
  });

  it('Position', () => {
    cy.validateFacetNumFilter('MinMax', 'Position', '156176849', /^1$/, false, 1);
    cy.validateFacetRank(4, 'Position');
  });

  it('Zygosity - Heterozygote', () => {
    cy.validateFacetFilter('Zygosity', 'Heterozygote', 'HET', /^13,151,959$/, 1);
    cy.validateFacetRank(5, 'Zygosity');
  });

  it('Transmission - Autosomal Recessive', () => {
    cy.validateFacetFilter('Transmission', 'Autosomal Recessive', 'autosomal_recessive', /^4,205,540$/, 1);
    cy.validateFacetRank(6, 'Transmission');
  });
});
