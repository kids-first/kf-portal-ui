import React, { ReactElement } from 'react';
import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/lib/types';
import { ReactKeycloakProvider as KeycloakProvider } from '@react-keycloak/web';
import keycloak from 'keycloak';

import { devDebug } from 'common/injectGlobals';
export interface IProvider {
  children: React.ReactNode;
}

const eventLogger = (eventType: AuthClientEvent, error?: AuthClientError) => {
  if (devDebug && error) {
    console.error('eventLogger ', 'eventType ', eventType);
    console.error('eventLogger ', error);
  }
};

const Keycloak = ({ children }: IProvider): ReactElement => (
  <KeycloakProvider authClient={keycloak} onEvent={eventLogger}>
    {children}
  </KeycloakProvider>
);

export default Keycloak;
