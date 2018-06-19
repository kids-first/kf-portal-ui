import Cookies from 'js-cookie';
import { cookiesDomain } from 'common/injectGlobals';

const defaultOptions = {
  secure: true,
  domain: cookiesDomain,
};

export const setCookie = (key, value, options = {}) => {
  document.cookie += ` ${key}=${value}; `;
  return Cookies.set(key, value, { ...defaultOptions, options });
};

export const getCookie = Cookies.get;

export const removeCookie = Cookies.remove;
