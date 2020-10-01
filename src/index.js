import 'babel-polyfill';
import 'style/dist/themes/default/antd.css';
import 'style/themes/default/main.scss';
import 'index.css';
// [NEXT] This css sheet should be brought back locally instead, in the long run
import '@kfarranger/components/public/themeStyles/beagle/beagle.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { initStore, getPreloadedState } from './store/index';
import { getAppElement } from './services/globalDomNodes.js';
import googleSDK from 'services/googleSDK';
import facebookSDK from 'services/facebookSDK';
import { initAnalyticsTracking } from 'services/analyticsTracking';
import { maintenanceMode } from 'common/injectGlobals';
import MaintenancePage from './MaintenancePage';

initAnalyticsTracking();
googleSDK();
facebookSDK();

const render = (rootElement) => {
  ReactDOM.render(rootElement, getAppElement());
};

if (maintenanceMode) {
  // TODO - TEMPORARY
  const store = initStore();
  render(
    <Provider store={store}>
      <MaintenancePage />
    </Provider>,
  );
} else {
  const preloadedState = getPreloadedState();
  const store = initStore(preloadedState);
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
