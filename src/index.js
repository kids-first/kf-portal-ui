import 'babel-polyfill';
import 'index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { initStore } from './store/index';
import App from './App';
import { getAppElement } from './services/globalDomNodes.js';
import googleSDK from 'services/googleSDK';
import facebookSDK from 'services/facebookSDK';
import { initAnalyticsTracking } from 'services/analyticsTracking';
import { loadDraftVirtualStudy } from 'services/virtualStudies';
import { maintenanceMode } from 'common/injectGlobals';
import MaintenancePage from './MaintenancePage';
import './i18n';

initAnalyticsTracking();
googleSDK();
facebookSDK();

const virtualStudies = loadDraftVirtualStudy() || undefined;
const preloadedState = {
  virtualStudies,
};
const store = initStore(preloadedState);

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    getAppElement(),
  );
};

if (maintenanceMode) {
  render(MaintenancePage);
} else {
  render(App);
}

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});

// webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
