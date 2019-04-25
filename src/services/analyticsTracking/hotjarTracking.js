import scriptjs from 'scriptjs';
import { lowerCase, snakeCase } from 'lodash';
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
  if (window.hj) {
    hj('vpv', path);
  } else {
    console.error('Unable to trackVirtualPageView, "window.hj" global not found');
  }
};

export const HJTrigger = ({ property, type, uiArea, action, label }) => {
  // example triggerName: record_portal__user_profile__Integration_Connection_init__cavatica
  const normalizeStr = str => snakeCase(lowerCase(str));

  const triggerName = `${normalizeStr(type)}_${normalizeStr(property)}__${normalizeStr(
    uiArea,
  )}__${normalizeStr(action)}__${normalizeStr(label)}`;
  console.info(`Hotjar Triggered: ${triggerName}`);
  hj('trigger', triggerName);
};
