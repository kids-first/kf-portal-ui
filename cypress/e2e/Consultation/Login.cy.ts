/// <reference types="cypress"/>
import '../../support/commands';

describe('Page Login', () => {
  it('Vérifier les informations affichées', () => {
    cy.visit('/');

    cy.contains('Available Data').should('exist');
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(0).contains(/\d{2}/).should('exist'); // data-cy="DataRelease_Study"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(0).contains('Studies').should('exist'); // data-cy="DataRelease_Study"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(1).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist'); // data-cy="DataRelease_Participant"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(1).contains('Participants').should('exist'); // data-cy="DataRelease_Participant"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(2).contains(/(\d{2}\.\d{1}|\d{2,3})K/).should('exist'); // data-cy="DataRelease_Family"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(2).contains('Families').should('exist'); // data-cy="DataRelease_Family"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(3).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist'); // data-cy="DataRelease_Biospecimen"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(3).contains('Biospecimens').should('exist'); // data-cy="DataRelease_Biospecimen"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(4).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist'); // data-cy="DataRelease_File"
    cy.get('[class*="DataRelease_dataReleaseStatsLabel"]').eq(4).contains('Data Files').should('exist'); // data-cy="DataRelease_File"
    cy.contains('Kids First Data Resource Portal').should('exist');

    cy.contains('Accelerating research and promoting new discoveries for children affected with cancer and structural birth defects.').should('exist');
    cy.contains(/Data from over \d{2,3}\,\d{3} samples\, including whole genome sequencing \(WGS\) and RNA\-Sequencing\, is available to empower your research today\./).should('exist');
    cy.get('[class*="Login"] button[class*="primary"]').contains('Login').should('exist'); // data-cy="Login"
    cy.get('[class*="Login"] button[class*="default"]').contains('Sign up').should('exist'); // data-cy="Signup"
  });
});
