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

export const removeCookie = (key, options = {}) => {
  Cookies.remove(key, { ...defaultOptions, ...options });
};

export const setCookie = (key, value, options = {}) => {
  const cookieOption = { ...defaultOptions, ...options };
  removeCookie(key, cookieOption);
  return Cookies.set(key, value, cookieOption);
};

window.Cookies = Cookies;

export const getCookie = Cookies.get;
