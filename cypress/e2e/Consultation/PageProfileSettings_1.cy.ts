/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitProfileSettingsPage();
});

describe('Page Profile Settings - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="Settings_profileSettingsHeader"]').contains('Profile Settings');
  });

  it('Section Identification - Tooltip', () => {
    cy.get('[class*="ToggleProfileVisibility_icon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
    cy.get('div[class="ant-tooltip-inner"]').contains('When your profile is public, other members can see information about you that includes your name, role, affiliation, and research interest.').should('exist');
  });

  it('Section Identification - Bannière', () => {
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('[class*="ant-alert-info"]').contains('You are authenticated with email using . This ID is never shown to the public and cannot be changed.').should('exist');
  });

  it('Section Identification - Champs', () => {
    cy.get('input[id="first_name"]').clear({force: true}).type('Cypress', {force: true});
    cy.get('input[id="last_name"]').clear({force: true}).type('Test', {force: true});
    cy.get('input[id="linkedin"]').clear({force: true});
    cy.get('input[id="website"]').clear({force: true});
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
  
    cy.get('label[for="first_name"]').contains('First Name').should('exist');
    cy.get('input[id="first_name"]').should('have.attr', 'value', 'Cypress').should('have.attr', 'placeholder', 'Your First Name');

    cy.get('label[for="last_name"]').contains('Last Name').should('exist');
    cy.get('input[id="last_name"]').should('have.attr', 'value', 'Test').should('have.attr', 'placeholder', 'Your Last Name');

    cy.get('label[for="linkedin"]').contains('LinkedIn').should('exist');
    cy.get('input[id="linkedin"]').should('have.attr', 'value', '').should('have.attr', 'placeholder', 'https://www.linkedin.com/in/username/');

    cy.get('label[for="website"]').contains('Website').should('exist');
    cy.get('input[id="website"]').should('have.attr', 'value', '').should('have.attr', 'placeholder', 'https://domain.com/username');
  });

  it('Section Role & Affiliation - Champs', () => {
    cy.get('input[id="affiliation"]').clear({force: true});
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).uncheck({force: true}).should('not.be.checked');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
  
    cy.get('label[for="affiliation"]').contains('Institution or organization').should('exist');
    cy.get('input[id="affiliation"]').should('have.attr', 'value', '').should('not.have.attr', 'placeholder');

    cy.get('label[for="roles"]').contains('Role').should('exist');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('[class*="ant-checkbox-group"]').contains('Check all that apply').should('exist');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('[class*="ant-checkbox-wrapper"]').eq(0).contains('Researcher').should('exist');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('[class*="ant-checkbox-wrapper"]').eq(1).contains('Healthcare Professional').should('exist');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('[class*="ant-checkbox-wrapper"]').eq(2).contains('Patient/Family Member').should('exist');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('[class*="ant-checkbox-wrapper"]').eq(3).contains('Community Member').should('exist');

    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).should('not.be.checked');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(1).should('not.be.checked');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(2).should('not.be.checked');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(3).should('be.checked');
  });

  it('Section Location - Champs', () => {
    cy.get('input[id="location_country"]').clear({force: true});
    cy.get('input[id="location_state"]').clear({force: true});
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(2).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
  
    cy.get('label[for="location_country"]').contains('Country').should('exist');
    cy.get('input[id="location_country"]').should('have.attr', 'value', '').should('not.have.attr', 'placeholder');

    cy.get('label[for="location_state"]').contains('State or province').should('exist');
    cy.get('input[id="location_state"]').should('have.attr', 'value', '').should('not.have.attr', 'placeholder');
  });

  it('Section Research Interest - Champs', () => {
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).then(($interestsSection) => {
      if ($interestsSection.find('.ant-select-clear').length > 0) {
        cy.wrap($interestsSection).find('[class="ant-select-clear"]').clickAndWait({force: true});
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).find('button[class*="ant-btn-primary"]').clickAndWait({force: true});
      };
    });

    cy.get('label[for="areas_of_interest"]').contains('Area of interest').should('exist');
    cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').should('not.exist');
  });
});
