import 'normalize.css';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getAppElement } from './services/globalDomNodes.js';
import googleSDK from 'services/googleSDK';
import facebookSDK from 'services/facebookSDK';
import { initAnalyticsTracking } from 'services/analyticsTracking';
import { init as initUsersnap } from 'services/usersnap';

import './i18n';

initAnalyticsTracking();
googleSDK();
facebookSDK();
initUsersnap();

const render = Component => {
  ReactDOM.render(<Component />, getAppElement());
};

render(App);

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});

// webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
