/// <reference types="Cypress" />
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
    cy.get('input[id="firstName"]').clear({force: true}).type('Cypress', {force: true});
    cy.get('input[id="lastName"]').clear({force: true}).type('Test', {force: true});
    cy.get('input[id="linkedin"]').clear({force: true});
    cy.get('input[id="website"]').clear({force: true});
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('button[class*="ant-btn-primary"]').click({force: true});
  
    cy.get('label[for="firstName"]').contains('First Name').should('exist');
    cy.get('input[id="firstName"]').should('have.attr', 'value', 'Cypress').should('have.attr', 'placeholder', 'Your First Name');

    cy.get('label[for="lastName"]').contains('Last Name').should('exist');
    cy.get('input[id="lastName"]').should('have.attr', 'value', 'Test').should('have.attr', 'placeholder', 'Your Last Name');

    cy.get('label[for="linkedin"]').contains('LinkedIn').should('exist');
    cy.get('input[id="linkedin"]').should('have.attr', 'value', '').should('have.attr', 'placeholder', 'https://www.linkedin.com/in/username/');

    cy.get('label[for="website"]').contains('Website').should('exist');
    cy.get('input[id="website"]').should('have.attr', 'value', '').should('have.attr', 'placeholder', 'https://domain.com/username');
  });

  it('Section Role & Affiliation - Champs', () => {
    cy.get('input[id="organization"]').clear({force: true});
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).uncheck({force: true}).should('not.be.checked');
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('button[class*="ant-btn-primary"]').click({force: true});
  
    cy.get('label[for="organization"]').contains('Institution or organization').should('exist');
    cy.get('input[id="organization"]').should('have.attr', 'value', '').should('not.have.attr', 'placeholder');

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
    cy.get('input[id="country"]').clear({force: true});
    cy.get('input[id="state"]').clear({force: true});
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(2).find('button[class*="ant-btn-primary"]').click({force: true});
  
    cy.get('label[for="country"]').contains('Country').should('exist');
    cy.get('input[id="country"]').should('have.attr', 'value', '').should('not.have.attr', 'placeholder');

    cy.get('label[for="state"]').contains('State or province').should('exist');
    cy.get('input[id="state"]').should('have.attr', 'value', '').should('not.have.attr', 'placeholder');
  });

  it('Section Research Interest - Champs', () => {
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).then(($interestsSection) => {
      if ($interestsSection.find('.ant-select-clear').length > 0) {
        cy.wrap($interestsSection).find('[class="ant-select-clear"]').click({force: true});
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).find('button[class*="ant-btn-primary"]').click({force: true});
      };
    });

    cy.get('label[for="interests"]').contains('Area of interest').should('exist');
    cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').should('not.exist');
  });
});

describe('Page Profile Settings - Valider les liens disponibles', () => {
  it('Lien du bouton View profile', () => {
    cy.get('[class*="Settings_profileSettingsHeader"] button').click({force: true}); // data-cy="ViewProfileButton"
    cy.get('[class*="ComunityProfile_avatarContainer"]').should('exist'); // data-cy="AvatarHeader"
  });

  it('Action du toggle de la section Identification [SKFP-1147]', () => {
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('[class="ant-card-head"] button[class*="ant-switch"]').then(($button) => {
      if (!$button.hasClass('ant-switch-checked')) {
        cy.wrap($button).click({force: true});
      };
    });

    cy.visitCommunityPage();
    cy.typeAndIntercept('[class*="Box_filterContentWrapper"]', 'Cypress', 'POST', '**/graphql', 1);
    cy.get('[class*="Community_usersListWrapper"]').contains('1 Public Member').should('exist');
    
    cy.visitProfileSettingsPage();
    cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('[class="ant-card-head"] button[class*="ant-switch"]').click({force: true});
    cy.visitCommunityPage();
    cy.get('[class*="Box_filterContentWrapper"]').type('Cypress');
    cy.wait(1000);
    cy.get('[class*="Community_usersListWrapper"]').contains('No Public Members').should('exist');
  });

    it('Bouton Discard changes de la section Identification', () => {
      cy.get('input[id="firstName"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="lastName"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="linkedin"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="website"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('button[class*="ant-btn-text"]').click({force: true});
      
      cy.get('input[id="firstName"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="lastName"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="linkedin"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="website"]').should('not.have.attr', 'value', 'Discard');
    });

    it('Bouton Discard changes de la section Role & Affiliation', () => {
      cy.get('input[id="organization"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).check({force: true}).should('be.checked');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('button[class*="ant-btn-text"]').click({force: true});
      
      cy.get('input[id="organization"]').should('not.have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).should('not.be.checked');
    });

    it('Bouton Discard changes de la section Location', () => {
      cy.get('input[id="country"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('input[id="state"]').clear({force: true}).type('Discard', {force: true}).should('have.attr', 'value', 'Discard');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(2).find('button[class*="ant-btn-text"]').click({force: true});
      
      cy.get('input[id="country"]').should('not.have.attr', 'value', 'Discard');
      cy.get('input[id="state"]').should('not.have.attr', 'value', 'Discard');
    });

    it('Bouton Discard changes de la section Research Interest', () => {
      cy.get('input[id="interests"]').clear({force: true}).type('Neuroblastoma', {force: true});
      cy.get('[title="Neuroblastoma"]').click({force: true});
      cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').eq(0).contains('Neuroblastoma').should('exist');
      cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).find('button[class*="ant-btn-text"]').click({force: true});

      cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').should('not.exist');
    });

      it('Bouton Save changes de la section Identification', () => {
        cy.get('input[id="firstName"]').clear({force: true}).type('FirstNameEdit', {force: true}).should('have.attr', 'value', 'FirstNameEdit');
        cy.get('input[id="lastName"]').clear({force: true}).type('LastNameEdit', {force: true}).should('have.attr', 'value', 'LastNameEdit');
        cy.get('input[id="linkedin"]').clear({force: true}).type('https://www.linkedin.com/in/edit/', {force: true}).should('have.attr', 'value', 'https://www.linkedin.com/in/edit/');
        cy.get('input[id="website"]').clear({force: true}).type('https://domain.com/edit', {force: true}).should('have.attr', 'value', 'https://domain.com/edit');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(0).find('button[class*="ant-btn-primary"]').click({force: true});
        cy.visitProfileViewPage();
        
        cy.get('body').contains('FirstNameEdit').should('exist');
        cy.get('body').contains('LastNameEdit').should('exist');
        cy.get('[href="https://www.linkedin.com/in/edit/"]').should('exist');
        cy.get('[href="https://domain.com/edit"]').should('exist');
      });

      it('Bouton Save changes de la section Role & Affiliation', () => {
        cy.get('input[id="organization"]').clear({force: true}).type('OrganizationEdit', {force: true}).should('have.attr', 'value', 'OrganizationEdit');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('input[class="ant-checkbox-input"]').eq(0).check({force: true}).should('be.checked');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(1).find('button[class*="ant-btn-primary"]').click({force: true});
        cy.visitProfileViewPage();
        
        cy.get('body').contains('OrganizationEdit').should('exist');
        cy.get('body').contains('Researcher').should('exist');
      });
  
      it('Bouton Save changes de la section Location', () => {
        cy.get('input[id="country"]').clear({force: true}).type('CountryEdit', {force: true}).should('have.attr', 'value', 'CountryEdit');
        cy.get('input[id="state"]').clear({force: true}).type('StateEdit', {force: true}).should('have.attr', 'value', 'StateEdit');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(2).find('button[class*="ant-btn-primary"]').click({force: true});
        cy.visitProfileViewPage();

        cy.get('body').contains('CountryEdit').should('exist');
        cy.get('body').contains('StateEdit').should('exist');
      });
  
      it('Bouton Save changes de la section Research Interest', () => {
        cy.get('input[id="interests"]').clear({force: true}).type('Neuroblastoma', {force: true});
        cy.get('[title="Neuroblastoma"]').click({force: true});
        cy.get('[class="ant-select-selector"] [class="ant-select-selection-overflow-item"]').eq(0).contains('Neuroblastoma').should('exist');
        cy.get('[class*="Gridcard_fuiCardWrapper"]').eq(3).find('button[class*="ant-btn-primary"]').click({force: true});
        cy.visitProfileViewPage();

        cy.get('body').contains('Neuroblastoma').should('exist');
      });
});