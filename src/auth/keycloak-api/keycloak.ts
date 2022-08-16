import Keycloak from "keycloak-js";
import { keycloakConfig } from "./config";

const keycloak = Keycloak(keycloakConfig);

export default keycloak;
