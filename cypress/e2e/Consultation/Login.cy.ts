/// <reference types="cypress"/>
import '../../support/commands';

describe('Page Login [SKFP-1208]', () => {
  it('Vérifier les informations affichées', () => {
    cy.visit('/');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(0).contains(/\d{2}/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(0).contains('Studies').should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(1).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(1).contains('Participants').should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(2).contains(/\d{2}M+/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(2).contains('Variants').should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(3).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(3).contains('Biospecimens').should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(4).contains(/\d{1}\.\d{2}PB/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(4).contains('Files').should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(5).contains(/\d{2}\.\d{1}K/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(5).contains('Genomes').should('exist');
  });
});
