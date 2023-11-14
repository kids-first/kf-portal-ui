import Keycloak from 'keycloak-js';

import { keycloakConfig } from './config';

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
