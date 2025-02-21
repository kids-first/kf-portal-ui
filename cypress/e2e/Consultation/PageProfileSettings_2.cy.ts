/// <reference types="cypress"/>
import '../../support/commands';
import { oneMinute } from '../../support/utils';

beforeEach(() => {
  cy.login();
  cy.visitProfileSettingsPage();
});

describe('Page Profile Settings - Valider les liens disponibles', () => {
  it('Lien du bouton View profile', () => {
    cy.get('[class*="Settings_profileSettingsHeader"] button').clickAndWait({force: true}); // data-cy="ViewProfileButton"
    cy.get('[class*="CommunityMemberProfilePage_avatarContainer"]').should('exist'); // data-cy="AvatarHeader"
  });

  it('Action du toggle de la section Identification [SKFP-1147]', () => {
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('[class="ant-card-head"] button[class*="ant-switch"]').then(($button) => {
      if (!$button.hasClass('ant-switch-checked')) {
        cy.wrap($button).clickAndWait({force: true});
      };
    });

    cy.visitCommunityPage();
    cy.typeAndIntercept('[class*="Box_filterContentWrapper"]', 'Cypress', 'POST', '**/graphql', 1);
    cy.get('[class*="Community_usersListWrapper"]').contains('1 Public Member').should('exist');
    
    cy.visitProfileSettingsPage();
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('[class="ant-card-head"] button[class*="ant-switch"]').clickAndWait({force: true});
    cy.visitCommunityPage();
    cy.get('[class*="Box_filterContentWrapper"]').type('Cypress');
    cy.waitWhileSpin(oneMinute);
    cy.get('[class*="Community_usersListWrapper"]').contains('No Public Members').should('exist');
  });

    it('Bouton Discard changes de la section Identification', () => {
      cy.get('input[id="first_name"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="last_name"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="linkedin"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="website"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('button[class*="ant-btn-text"]').clickAndWait({force: true});
      
      cy.get('input[id="first_name"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="last_name"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="linkedin"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="website"]').should('not.have.attr', 'value', 'Discard');
    });

    it('Bouton Discard changes de la section Role & Affiliation', () => {
      cy.get('input[id="affiliation"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).check({force: true}).should('be.checked');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('button[class*="ant-btn-text"]').clickAndWait({force: true});
      
      cy.get('input[id="affiliation"]').should('not.have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).should('not.be.checked');
    });

    it('Bouton Discard changes de la section Location', () => {
      cy.get('input[id="location_country"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="location_state"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(2).find('button[class*="ant-btn-text"]').clickAndWait({force: true});
      
      cy.get('input[id="location_country"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="location_state"]').should('not.have.attr', 'value', 'Discard');
    });

    it('Bouton Discard changes de la section Research Interest', () => {
      cy.get('input[id="areas_of_interest"]').clear({force: true}).type('Neuroblastoma', {force: true});
      cy.get('[title="Neuroblastoma"]').clickAndWait({force: true});
      cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').eq(0).contains('Neuroblastoma').should('exist');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).find('button[class*="ant-btn-text"]').clickAndWait({force: true});

      cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').should('not.exist');
    });

      it('Bouton Save changes de la section Identification', () => {
        cy.get('input[id="first_name"]').clear({force: true}).type('FirstNameEdit', {force: true}).should('have.attr', 'value', 'FirstNameEdit');
        cy.get('input[id="last_name"]').clear({force: true}).type('LastNameEdit', {force: true}).should('have.attr', 'value', 'LastNameEdit');
        cy.get('input[id="linkedin"]').clear({force: true}).type('https://www.linkedin.com/in/edit/', {force: true}).should('have.attr', 'value', 'https://www.linkedin.com/in/edit/');
        cy.get('input[id="website"]').clear({force: true}).type('https://domain.com/edit', {force: true}).should('have.attr', 'value', 'https://domain.com/edit');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
        cy.visitProfileViewPage();
        
        cy.get('body').contains('FirstNameEdit').should('exist');
        cy.get('body').contains('LastNameEdit').should('exist');
        cy.get('[href="https://www.linkedin.com/in/edit/"]').should('exist');
        cy.get('[href="https://domain.com/edit"]').should('exist');
      });

      it('Bouton Save changes de la section Role & Affiliation', () => {
        cy.get('input[id="affiliation"]').clear({force: true}).type('OrganizationEdit', {force: true}).should('have.attr', 'value', 'OrganizationEdit');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).check({force: true}).should('be.checked');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
        cy.visitProfileViewPage();
        
        cy.get('body').contains('OrganizationEdit').should('exist');
        cy.get('body').contains('Researcher').should('exist');
      });
  
      it('Bouton Save changes de la section Location', () => {
        cy.get('input[id="location_country"]').clear({force: true}).type('CountryEdit', {force: true}).should('have.attr', 'value', 'CountryEdit');
        cy.get('input[id="location_state"]').clear({force: true}).type('StateEdit', {force: true}).should('have.attr', 'value', 'StateEdit');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(2).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
        cy.visitProfileViewPage();

        cy.get('body').contains('CountryEdit').should('exist');
        cy.get('body').contains('StateEdit').should('exist');
      });
  
      it('Bouton Save changes de la section Research Interest', () => {
        cy.get('input[id="areas_of_interest"]').clear({force: true}).type('Neuroblastoma', {force: true});
        cy.get('[title="Neuroblastoma"]').clickAndWait({force: true});
        cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').eq(0).contains('Neuroblastoma').should('exist');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
        cy.visitProfileViewPage();

        cy.get('body').contains('Neuroblastoma').should('exist');
      });
});
