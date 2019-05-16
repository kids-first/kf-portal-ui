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

const render = rootElement => {
  ReactDOM.render(rootElement, getAppElement());
};

if (maintenanceMode) {
  render(<MaintenancePage />);
} else {
  const virtualStudies = loadDraftVirtualStudy() || undefined;
  const preloadedState = {
    virtualStudies,
  };
  const store = initStore(preloadedState);
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
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
