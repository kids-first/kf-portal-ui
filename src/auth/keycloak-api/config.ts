import EnvVariables from "helpers/EnvVariables";

export const keycloakConfig = {
  realm: EnvVariables.configFor("KC_REALM"),
  url: EnvVariables.configFor("KC_AUTH_SERVER_URL"),
  clientId: EnvVariables.configFor("KC_CLIENT_ID"),
};
