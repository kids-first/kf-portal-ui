import scriptjs from 'scriptjs';
import urlJoin from 'url-join';
import { hotjarHost, hotjarId } from 'common/injectGlobals';
const hj = window.hj;

export const init = () => scriptjs(`${hotjarHost}${hotjarId}.js?sv=6`);

export const trackVirtualPageView = path => {
  if (hj) {
    hj('vpv', path);
  } else {
    console.error('Unable to trackVirtualPageView, hj global not found');
  }
};
