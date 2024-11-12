// react-intl
import intl from 'react-intl-universal';

const locales = require('./src/locales/index');
const { LANG } = require('./src/common/constants');
intl.init({ locales: { [LANG.EN]: locales.default.en }, currentLocale: LANG.EN });

// matchmedia fix
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation((query) => ({
    // deprecated
    addEventListener: jest.fn(),

    addListener: jest.fn(),

    dispatchEvent: jest.fn(),

    matches: false,

    media: query,

    onchange: null,

    removeEventListener: jest.fn(),
    // deprecated
    removeListener: jest.fn(),
  })),
  writable: true,
});

global.ResizeObserver = require('resize-observer-polyfill');
