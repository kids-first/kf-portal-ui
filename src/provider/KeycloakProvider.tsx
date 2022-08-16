import React, { ReactElement } from "react";
import {
  AuthClientError,
  AuthClientEvent,
} from "@react-keycloak/core/"
import EnvVariables from "helpers/EnvVariables";
import { ReactKeycloakProvider as KeycloakProvider } from "@react-keycloak/web";
import keycloak from "auth/keycloak-api/keycloak";

export interface IProvider {
  children: React.ReactNode;
}

const eventLogger = (eventType: AuthClientEvent, error?: AuthClientError) => {
  if (EnvVariables.configFor("ENV") === "development" && error) {
    console.error("eventLogger ", "eventType ", eventType);
    console.error("eventLogger ", error);
  }
};

const Keycloak = ({ children }: IProvider): ReactElement => (
  <KeycloakProvider authClient={keycloak} onEvent={eventLogger}>
    {children}
  </KeycloakProvider>
);

export default Keycloak;
