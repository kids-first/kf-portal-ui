import scriptjs from 'scriptjs';
import urlJoin from 'url-join';
import { hotjarHost, hotjarId } from 'common/injectGlobals';

const hj = () => {
  window.hj =
    window.hj ||
    function() {
      (hj.q = hj.q || []).push(arguments);
    };
  return window.hj;
};

export const init = () => scriptjs(`${hotjarHost}${hotjarId}.js?sv=6`);

export const HJVirtualPageView = path => {
  if (hj) {
    hj('vpv', path);
  } else {
    console.error('Unable to trackVirtualPageView, hj global not found');
  }
};

export const HJTrigger = triggerName => hj('trigger', triggerName);
