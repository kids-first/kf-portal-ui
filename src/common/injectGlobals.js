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

export const egoApiRoot: string = egoApiOverride || process.env.REACT_APP_EGO_API || '';

const personaApiOverride = qs.PERSONA_API;
if (personaApiOverride) {
  global.log('warning: using persona api override');
}

export const personaApiRoot: string = personaApiOverride || process.env.REACT_APP_PERSONA_API || '';
export const secretStorageApiRoot: string = process.env.REACT_APP_SECRETS_API;
export const cavaticaApiRoot: string = process.env.REACT_APP_CAVATICA_API;
export const gen3ApiRoot: string = process.env.REACT_APP_GEN3_API;

export const googleAppId = process.env.REACT_APP_GOOGLE_APP_ID;
export const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
export const egoAppId = process.env.REACT_APP_EGO_APP_ID;
export const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export const defaultRedirectUri = process.env.REACT_APP_DEFAULT_REDIRECT_URI || '';

export const allRedirectUris = (process.env.REACT_APP_LOGIN_REDIRECT_NOT_REQUIRED || '')
  .split(',')
  .concat(defaultRedirectUri)
  .filter(Boolean);
