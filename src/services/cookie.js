import Cookies from 'js-cookie';
import { cookiesDomain } from 'common/injectGlobals';

const hostName = window.location.hostname;
const hostNamePaths = hostName.split('.');
const defaultDomain =
  hostNamePaths.length >= 2
    ? `.${hostNamePaths.slice(hostNamePaths.length - 2, hostNamePaths.length).join('.')}`
    : hostName;

const defaultOptions = {
  secure: true,
  domain: cookiesDomain || defaultDomain,
};

export const setCookie = (key, value, options = {}) =>
  Cookies.set(key, value, { ...defaultOptions, options });

export const getCookie = Cookies.get;

export const removeCookie = Cookies.remove;
