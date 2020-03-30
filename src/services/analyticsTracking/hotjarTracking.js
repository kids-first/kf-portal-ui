import lowerCase from 'lodash/lowerCase';
import snakeCase from 'lodash/snakeCase';

export const HJVirtualPageView = path => {
  if (window.hj) {
    window.hj('vpv', path);
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
  window.hj('trigger', triggerName);
};
