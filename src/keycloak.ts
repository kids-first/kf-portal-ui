import Keycloak from 'keycloak-js';

import { kcAuthUrl, kcClientId, kcRealm } from './common/injectGlobals';

const keycloak = Keycloak({
  realm: kcRealm,
  url: kcAuthUrl,
  clientId: kcClientId,
});

export default keycloak;
