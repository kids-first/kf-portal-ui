import Cookies from 'js-cookie';
import { cookiesDomain } from 'common/injectGlobals';

const hostName = window.location.hostname;
const hostNamePaths = hostName.split('.');
const defaultDomain =
  hostNamePaths.length >= 2
    ? `.${hostNamePaths.slice(hostNamePaths.length - 2, hostNamePaths.length).join('.')}`
    : hostName;

const defaultOptions = {
  secure: false,
  domain: cookiesDomain || defaultDomain,
};

export const removeCookie = (key) => {
  Cookies.remove(key)
};

export const setCookie = (key, value, options = {}) => {
  removeCookie(key);
  return Cookies.set(key, value, { ...defaultOptions, ...options });
};

window.Cookies = Cookies

export const getCookie = Cookies.get;
