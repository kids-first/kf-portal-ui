/// <reference types="Cypress" />
import '@testing-library/cypress/add-commands';
import createUUID from './createUUID';

export interface Replacement {
  placeholder: string;
  value: string;
}

Cypress.Commands.add('login', () => {
  cy.session(['user'], () => {
    cy.visit('/dashboard');

    cy.request({
      url: `https://keycloak-qa.kf-strides.org/realms/kidsfirstdrc/protocol/openid-connect/auth`,
      qs: {
        client_id: 'portal-ui',
        redirect_uri: Cypress.config('baseUrl'),
        kc_idp_hint: null,
        scope: 'openid',
        state: createUUID(),
        nonce: createUUID(),
        response_type: 'code',
        response_mode: 'fragment',
      },
    }).then((response) => {
      const html: HTMLElement = document.createElement('html');
      html.innerHTML = response.body;

      const script = html.getElementsByTagName('script')[0] as HTMLScriptElement;

      eval(script.textContent ?? '');

      const loginUrl: string = (window as any).kcContext.url.loginAction;

      return cy.request({
        form: true,
        method: 'POST',
        url: loginUrl,
        followRedirect: false,
        body: {
          username: Cypress.env('user_username'),
          password: Cypress.env('user_password'),
        },
      });
    });

    cy.wait(2000);
    cy.visit('/dashboard');
 });
});

Cypress.Commands.add('logout', () => {
    cy.visit('/');
    cy.wait(5*1000);

    cy.get('div').then(($div) => {
        if ($div.hasClass('App')) {
            cy.get('[data-icon="down"]').eq(1).click({force: true});
            cy.get('[data-menu-id*="logout"]').click({force: true});
        };
    });

  cy.wait(1000);
});

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));