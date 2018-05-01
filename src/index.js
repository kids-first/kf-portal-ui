import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getAppElement } from './services/globalDomNodes.js';
import googleSDK from 'services/googleSDK';
import facebookSDK from 'services/facebookSDK';
import { initAnalyticsTracking }  from 'services/analyticsTracking';
import './i18n';

initAnalyticsTracking([{
    trackingId: process.env.REACT_APP_GA_TRACKING_ID,
    gaOptions:{
        name: 'Beta.kids-first.io Tracker'
    }
}]);

googleSDK();
facebookSDK();


ReactDOM.render(<App />, getAppElement());

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
