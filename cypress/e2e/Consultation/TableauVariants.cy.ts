/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page des variants - Consultation du tableau', () => {
  beforeEach(() => {
    cy.visitVariantsPage('?sharedFilterId=70eb0eed-db95-428a-91fb-c4b1f71b0b27');
    cy.showColumn('CADD');
    cy.showColumn('REVEL');
    cy.showColumn(/^ALT$/);
    cy.showColumn('Homo.');
  });

  it('Vérifier les informations affichées', () => {
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(1).contains('chr11:g.119345794C>T').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(2).contains('SNV').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(3).find('[class*="anticon"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(4).contains('MFRP').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(5).find('[class*="moderateImpact"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(5).contains('Missense').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(5).contains('p.Val136Met').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(6).find('path[d*="M12.1872"]').should('exist'); // C
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(6).find('path[d*="0C5.37258"]').should('exist'); // M
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(7).contains('AR').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(7).find('[class*="ant-tag-blue"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(8).contains(/^B$/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(8).contains(/^LB$/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(8).find('[class*="ant-tag-green"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(8).find('[class*="ant-tag-lime"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(9).find('[class*="gnomadIndicatorDefault"]').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(9).contains('2.46e-1').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(10).contains('37,345').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(11).contains('135').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(11).contains(/(5.\d{2}e-1)/).should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(12).contains('1').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(13).contains('0.003').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(14).contains('-').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(15).contains('163').should('exist');
    cy.get('tr[data-row-key]').eq(0).find('[class*="ant-table-cell"]').eq(16).contains('28').should('exist');
  });
 
  it('Valider l\'icône de sauvegarde des requêtes personnalisées', () => {
    cy.get('[data-cy="SidebarMenuItem_Variant"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
    cy.checkValueFacetAndApply('Variant Type', 'SNV');
    cy.get('[class*="QueryBar_selected"]').find('[class*="anticon-save"]').should('not.exist');
  });
 
  it('Valider les liens disponibles Lien Variant', () => {
    cy.get('tr[data-row-key]').eq(0).contains('chr11:g.119345794C>T').click({force: true});
    cy.get('[class*="EntityTitle"]').contains('chr11:g.119345794C>T');
  });
 
  it('Valider les liens disponibles Lien dbSNP', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(3).find('a[href]')
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/snp/rs3814762');
  });
 
  it('Valider les liens disponibles Lien Gene', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(4).find('a[href]')
    .should('have.attr', 'href', 'https://www.omim.org/entry/606227');
  });
 
  it('Valider les liens disponibles Lien Gene Plus', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(4).find('[data-icon="plus"]').click({force: true});
    cy.validatePillSelectedQuery('Genes Symbol', ['MFRP']);
  });
 
  it('Valider les liens disponibles Lien OMIM', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(7).find('a[href]')
      .should('have.attr', 'href', 'https://www.omim.org/entry/606227');
  });
 
  it('Valider les liens disponibles Lien ClinVar', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(8).find('a[href]').eq(0)
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/167299');
  });
 
  it('Valider les liens disponibles Lien Part.', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(11).find('a[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT').should('exist');
  });
 
  it('Valider les liens disponibles Lien Studies', () => {
    cy.get('tr[data-row-key]').eq(0).find('td').eq(12).find('a[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-EATF').should('exist');
  });
});

describe('Page des variants - Consultation du tableau', () => {
  beforeEach(() => {
    cy.visitVariantsPage();
  });
  
  it('Valider les fonctionnalités du tableau - Tri Variant', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Variant', 1);
    cy.validateTableFirstRow('chr10:g.100000222G>A', 1, true);
    cy.sortTableAndIntercept('Variant', 1);
    cy.validateTableFirstRow('chrY:g.9999310C>A', 1, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Type', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Type', 1);
    cy.validateTableFirstRow('SNV', 2, true);
    cy.sortTableAndIntercept('Type', 1);
    cy.validateTableFirstRow('Ins', 2, true);
  });

  it('Valider les fonctionnalités du tableau - Tri gnomAD', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept(/^gnomAD$/, 1);
    cy.validateTableFirstRow('-', 9, true);
    cy.sortTableAndIntercept(/^gnomAD$/, 1);
    cy.validateTableFirstRow('1.00e+0', 9, true);
  });

  it('Valider les fonctionnalités du tableau - Tri gnomAD ALT', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('gnomAD ALT', 1);
    cy.validateTableFirstRow('-', 10, true);
    cy.sortTableAndIntercept('gnomAD ALT', 1);
    cy.validateTableFirstRow('152,312', 10, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Part.', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Part.', 1);
    cy.validateTableFirstRow(/^1/, 11, true);
    cy.sortTableAndIntercept('Part.', 1);
    cy.validateTableFirstRow('242', 11, true);
  });

  it('Valider les fonctionnalités du tableau - Tri ALT', () => {
    cy.showColumn(/^ALT$/);
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept(/^ALT$/, 1);
    cy.validateTableFirstRow(/^1$/, 13, true);
    cy.sortTableAndIntercept(/^ALT$/, 1);
    cy.validateTableFirstRow('484', 13, true);
  });

  it('Valider les fonctionnalités du tableau - Tri Homo.', () => {
    cy.showColumn('Homo.');
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Homo.', 1);
    cy.validateTableFirstRow(/^0$/, 13, true);
    cy.sortTableAndIntercept('Homo.', 1);
    cy.validateTableFirstRow('242', 13, true);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.waitWhileSpin(2000);

    cy.sortTableAndIntercept('Type', 1);
    cy.sortTableAndIntercept('Type', 1);
    cy.sortTableAndIntercept('Variant', 1);
    cy.wait(2000);
    cy.validateTableFirstRow('chr10:g.100000879_100000880insC', 1, true);
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
  