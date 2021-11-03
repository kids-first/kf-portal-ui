/* eslint-disable simple-import-sort/imports */
import 'react-app-polyfill/stable';

// Here, styles should be imported first to apply correctly.
import 'style/dist/themes/default/antd.css';
import 'style/themes/default/main.scss';
import 'index.css';
// [NEXT] This css sheet should be brought back locally instead, in the long run
import '@kfarranger/components/public/themeStyles/beagle/beagle.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { maintenanceMode } from 'common/injectGlobals';
import { initAnalyticsTracking } from 'services/analyticsTracking';

import { getAppElement } from './services/globalDomNodes.js';
import App from './App';
import MaintenancePage from './MaintenancePage';
import * as serviceWorker from './serviceWorker';

initAnalyticsTracking();

const render = (rootElement) => {
  ReactDOM.render(rootElement, getAppElement());
};

render(maintenanceMode ? <MaintenancePage /> : <App />, getAppElement());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
