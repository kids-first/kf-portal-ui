/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page d\'un participant - Colonnes du tableau Family', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('family');
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('[id="family"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Participant ID').should('exist');
    
    cy.get('[id="family"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Family Relationship').should('exist');
  });

  it('Masquer/Afficher une colonne affichée', () => {
    cy.get('[id="family"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Participant ID').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Participant ID')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('[id="family"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Participant ID').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Participant ID')
      .find('[type="checkbox"]').check({force: true});

    cy.get('[id="family"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Participant ID').should('exist');
  });
});

describe('Page d\'un participant - Colonnes du tableau Diagnoses', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('diagnosis');
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Diagnosis (MONDO)').should('exist');
    
    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Diagnosis (NCIT)').should('exist');
    
    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Diagnosis (Source Text)').should('exist');
  
    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Age').should('exist');

    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('MONDO Term').should('exist');
  });

  it('Masquer/Afficher une colonne affichée', () => {
    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Diagnosis (MONDO)').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Diagnosis (MONDO)')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Diagnosis (MONDO)').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Diagnosis (MONDO)')
      .find('[type="checkbox"]').check({force: true});

    cy.get('[id="diagnosis"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Diagnosis (MONDO)').should('exist');
  });
});

describe('Page d\'un participant - Colonnes du tableau Phenotypes', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('phenotype');
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Phenotype (HPO)').should('exist');
    
    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Phenotype (Source Text)').should('exist');

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Interpretation').should('exist');

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Age').should('exist');

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('HPO Term').should('exist');
  });

  it('Masquer/Afficher une colonne affichée', () => {
    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Phenotype (HPO)').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Phenotype (HPO)')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Phenotype (HPO)').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Phenotype (HPO)')
      .find('[type="checkbox"]').check({force: true});

    cy.get('[id="phenotype"]')
      .find('thead[class="ant-table-thead"]')
      .contains('Phenotype (HPO)').should('exist');
  });
});

describe('Page d\'un participant - Colonnes du tableau Biospecimens', () => {
  beforeEach(() => {
    cy.visitParticipantEntity('PT_01236T3G');
    cy.resetColumns('biospecimen');
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('[id="biospecimen"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Sample ID').should('exist');
    
    cy.get('[id="biospecimen"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Collection ID').should('exist');

    cy.get('[id="biospecimen"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains(/^Sample Type$/).should('exist');

    cy.get('[id="biospecimen"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Collection Sample Type').should('exist');

    cy.get('[id="biospecimen"]')
      .find('thead[class="ant-table-thead"]')
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('not.have.class', 'ant-table-column-has-sorters')
      .contains('Age').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Anatomical Site (NCIT)').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(6)
      .contains('Anatomical Site (NCIT)').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Anatomical Site (Source Text)').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(7)
      .contains('Anatomical Site (Source Text)').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Tumor Descriptor (Source Text)').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(8)
      .contains('Tumor Descriptor (Source Text)').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Tumor Location (Source Text)').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(9)
      .contains('Tumor Location (Source Text)').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Consent Code (dbGaP)').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(10)
      .contains('Consent Code (dbGaP)').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Consent Type').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(11)
      .contains('Consent Type').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Volume').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(12)
      .contains('Volume').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Volume Unit').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(13)
      .contains('Volume Unit').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Sample Availability').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(14)
      .contains('Sample Availability').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Parent Sample ID').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(15)
      .contains('Parent Sample ID').should('exist');

    cy.get('thead[class="ant-table-thead"]')
      .contains('Parent Sample Type').should('not.exist');
    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').eq(16)
      .contains('Parent Sample Type').should('exist');
  });

  it('Masquer une colonne affichée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('Collection ID').should('exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Collection ID')
      .find('[type="checkbox"]').uncheck({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('Collection ID').should('not.exist');
  });

  it('Afficher une colonne masquée', () => {
    cy.get('thead[class="ant-table-thead"]')
      .contains('Volume Unit').should('not.exist');

    cy.get('div[class="ant-popover-inner"]')
      .find('div[class="ant-space-item"]').contains('Volume Unit')
      .find('[type="checkbox"]').check({force: true});

    cy.get('thead[class="ant-table-thead"]')
      .contains('Volume Unit').should('exist');
  });
});