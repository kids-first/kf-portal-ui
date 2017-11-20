import 'index.css';
import queryString from 'querystring';

localStorage.setItem('debug', process.env.REACT_APP_DEBUG || ''); // manually set because CRA doesn't allow arbitrary env variable names.
const debug = require('debug') as Function;
global.log = debug('app');

const qs = queryString.parse(global.location.search.replace(/^\?/, ''));
const apiOverride = qs.APP_API as string;

if (apiOverride) {
  global.log('warning: using api override');
}

export const apiRoot: string = apiOverride || process.env.REACT_APP_API || '';
