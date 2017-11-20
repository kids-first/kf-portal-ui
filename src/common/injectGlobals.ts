import 'index.css';
import queryString from 'querystring';

localStorage.setItem('debug', process.env.REACT_APP_DEBUG || ''); // manually set because CRA doesn't allow arbitrary env variable names.
const debug = require('debug') as Function;
global.log = debug('app');

const qs = queryString.parse(global.location.search.replace(/^\?/, ''));

const egoApiOverride = qs.EGO_API as string;
if (egoApiOverride) {
  global.log('warning: using ego api override');
}

export const egoApiRoot: string = egoApiOverride || process.env.REACT_APP_EGO_API || '';

const personaApiOverride = qs.PERSONA_API as string;
if (personaApiOverride) {
  global.log('warning: using persona api override');
}

export const personaApiRoot: string = personaApiOverride || process.env.REACT_APP_PERSONA_API || '';

export const googleAppId = process.env.REACT_APP_GOOGLE_APP_ID;
export const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
export const egoAppId = process.env.REACT_APP_EGO_APP_ID;
