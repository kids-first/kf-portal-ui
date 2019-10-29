import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
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

const render = rootElement => {
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

// [NEXT] Hot Reload: not sure if this is necessary in this version of CRA
// webpack Hot Module Replacement API
// if (module.hot) {
//   module.hot.accept('./App', () => {
//     render(App);
//   });
// }
