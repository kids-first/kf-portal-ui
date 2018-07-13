import 'index.css';
import queryString from 'querystring';

localStorage.setItem('debug', process.env.REACT_APP_DEBUG || ''); // manually set because CRA doesn't allow arbitrary env variable names.
const debug = require('debug');
global.log = debug('app');

const qs = queryString.parse(global.location.search.replace(/^\?/, ''));

const egoApiOverride = qs.EGO_API;
if (egoApiOverride) {
  global.log('warning: using ego api override');
}
export const devDebug = process.env.NODE_ENV === 'development';

export const egoApiRoot: string = egoApiOverride || process.env.REACT_APP_EGO_API || '';

const personaApiOverride = qs.PERSONA_API;
if (personaApiOverride) {
  global.log('warning: using persona api override');
}

export const shortUrlApi = process.env.REACT_APP_SHORTURL_API;

export const arrangerApiRoot = process.env.REACT_APP_ARRANGER_API;

export const arrangerProjectId = process.env.REACT_APP_PROJECT_ID;

export const personaApiRoot: string = personaApiOverride || process.env.REACT_APP_PERSONA_API || '';
export const secretStorageApiRoot: string = process.env.REACT_APP_SECRETS_API;

export const cavaticaApiRoot: string = process.env.REACT_APP_CAVATICA_API;
export const cavaticaWebRoot: string = process.env.REACT_APP_CAVATICA_WEB;
export const cavaticaWebRegistrationRoot: string = process.env.REACT_APP_CAVATICA_WEB_REGISTRATION;

export const gen3ApiRoot: string = process.env.REACT_APP_GEN3_API;
export const gen3WebRoot: string = process.env.REACT_APP_GEN3_WEB;

export const googleAppId = process.env.REACT_APP_GOOGLE_APP_ID;
export const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
export const egoAppId = process.env.REACT_APP_EGO_APP_ID;
export const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export const usersnapHost = process.env.REACT_APP_USERSNAP_HOST;
export const usersnapId = process.env.REACT_APP_USERSNAP_ID;

export const gaTrackingID: string = process.env.REACT_APP_GA_TRACKING_ID;

export const defaultRedirectUri = process.env.REACT_APP_DEFAULT_REDIRECT_URI || '';

export const allRedirectUris = (process.env.REACT_APP_LOGIN_REDIRECT_NOT_REQUIRED || '')
  .split(',')
  .concat(defaultRedirectUri)
  .filter(Boolean);

export const requireLogin = process.env.REACT_APP_REQUIRE_LOGIN === 'true';

export const kfWebRoot: string = process.env.REACT_APP_KF_WEB_ROOT;
export const kfFacebook: string = process.env.REACT_APP_KF_FACEBOOK;
export const kfTwitter: string = process.env.REACT_APP_KF_TWITTER;
export const kfGithub: string = process.env.REACT_APP_KF_GITHUB;
export const kfMailchimpList: string = process.env.REACT_APP_KF_MAILCHIMP_LIST;

export const cookiesDomain: string = process.env.REACT_APP_COOKIES_DOMAIN;
export const maintenanceMode: Boolean = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
export const oauthRedirectUrl: string = encodeURIComponent(
  process.env.REACT_APP_OAUTH_REDIRECT_URL || `${window.location.origin}/oauth_redirect/`,
);
export const gen3OauthRedirect: string = encodeURIComponent(
  `${window.location.origin}/gen3_redirect/`,
);
export const gen3IntegrationRoot: string = process.env.REACT_APP_GEN3_INTEGRATION_ROOT || '';
