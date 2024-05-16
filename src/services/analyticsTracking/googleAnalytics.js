import ReactGA from 'react-ga4';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';

import { debugGoogleAnalytics, devDebug, gaTrackingID } from 'common/injectGlobals';

import history from '../history';

import { TRACKING_EVENTS } from './trackingEventConstants';

const devTrackingID = localStorage.getItem('DEV_GA_TRACKING_ID');

if (devDebug && devTrackingID) {
  console.warn('warning: using GA Tracking ID override');
}

let GAState = {
  trackingId: devDebug || devTrackingID ? devTrackingID || gaTrackingID : gaTrackingID,
  userId: null, //int
  userRoles: null, //string
  clientId: null, //string
  groups: null, // array?,
  cavaticaProjects: null,
};
let timingsStorage = window.localStorage;

export const initGATracking = () => {
  ReactGA.initialize(GAState.trackingId, { debug: Boolean(devDebug && debugGoogleAnalytics) });
  ReactGA.ga(function (tracker) {
    var clientId = tracker.get('clientId');
    addStateInfo({ clientId });

    // GA Custom Dimension:index 3: clientId
    // ReactGA.set({ clientId: GAState.clientId });
    ReactGA.set({ dimension3: GAState.clientId });
  });
};

export const setUserDimension = (dimension, val) => {
  const serialized = isObject(val) ? JSON.stringify(val) : val;
  ReactGA.set({ [dimension]: serialized });
};

const setUserDimensions = (userId, role, groups) => {
  ReactGA.set({ clientId: GAState.clientId });
  if (userId || GAState.userId) {
    ReactGA.set({ userId: userId || GAState.userId });
    // GA Custom Dimension:index 1: userId (egoId)
    ReactGA.set({ dimension1: userId || GAState.userId });
  }
  if (role || GAState.userRoles) {
    // GA Custom Dimension:index 2: userRole (current selected profi;le role)
    // ReactGA.set({ userRole: role || GAState.userRoles[0] });
    ReactGA.set({ dimension2: role || GAState.userRoles[0] });
  }

  if ((groups && groups.length) || (GAState.groups && GAState.groups.length)) {
    let _groups = JSON.stringify({ groups: groups ? groups : GAState.groups });
    // GA Custom Dimension:index 4: user groups (pulled from jwt)
    ReactGA.set({ dimension4: _groups });
  }
  // dimension6 is userCavaticaProjects
};

export const addStateInfo = (obj) => merge(GAState, obj);

export const getUserAnalyticsState = () => GAState;

export const trackUserSession = async ({ egoId, _id, acceptedTerms, roles, groups }) => {
  let userId = egoId;
  if (acceptedTerms && !GAState.userId) {
    addStateInfo({ userId, personaId: _id, userRoles: roles, groups });
    setUserDimensions(userId, roles[0], groups);
    return true;
  } else {
    return false;
  }
};

export const trackUserInteraction = async ({ category, action, label, value }) => {
  setUserDimensions(
    GAState.userId,
    GAState.userRoles ? GAState.userRoles[0] : null,
    GAState.groups,
  );
  ReactGA.event({ category, action, label, value });
  switch (category) {
    case TRACKING_EVENTS.categories.modals:
      if (action === TRACKING_EVENTS.actions.open) {
        startAnalyticsTiming(TRACKING_EVENTS.timings.modal + `${label}`);
      } else if (action === TRACKING_EVENTS.actions.close) {
        stopAnalyticsTiming(TRACKING_EVENTS.timings.modal + `${label}`, {
          category,
          variable: 'open duration',
          label: label || null,
        });
      }

      break;
    case TRACKING_EVENTS.categories.join:
      if (action === TRACKING_EVENTS.actions.signedUp) {
        stopAnalyticsTiming(TRACKING_EVENTS.labels.joinProcess, {
          category,
          variable: 'Join process completion time',
          ...(label & label),
        });
      }
      break;
    case 'File Repo: Filters - Advanced':
    case TRACKING_EVENTS.categories.fileRepo.filters: {
      const downloadEventStarted = timingsStorage.getItem(getTimingEventName('FILE_DOWNLOAD'));
      if (action === 'Filter Selected' && !downloadEventStarted) {
        startAnalyticsTiming(TRACKING_EVENTS.timings.queryToDownload);
        startAnalyticsTiming(TRACKING_EVENTS.timings.queryToCavatica);
      }
      break;
    }
    case TRACKING_EVENTS.categories.fileRepo.actionsSidebar:
      if (
        action === TRACKING_EVENTS.actions.download.report ||
        action === `${TRACKING_EVENTS.actions.download.manifest} ${TRACKING_EVENTS.actions.click}`
      ) {
        stopAnalyticsTiming(TRACKING_EVENTS.timings.queryToDownload, {
          category: 'File Acquisition',
          variable: 'First Query Filter to Download Files clicked',
          ...(label & label),
        });
      }
      if (action === 'Copied Files to Cavatica Project') {
        stopAnalyticsTiming(TRACKING_EVENTS.timings.queryToCavatica, {
          category: 'File Acquisition',
          variable: 'First Query Filter to Copy to Cavatica clicked',
          ...(label & label),
        });
      }
      break;
    case TRACKING_EVENTS.categories.fileRepo.dataTable:
      if (action === TRACKING_EVENTS.actions.query.save) {
        localStorage.setItem('KF_GA_QUERY_SAVED', true);
      }
      break;
    default:
      break;
  }
};

const sanitizeName = (name) => name.toUpperCase().replace(/\s/g, '_');
const getTimingEventName = (name) => `KF_GA_TIMING_INIT_${sanitizeName(name)}`;

export const startAnalyticsTiming = (eventName) => {
  timingsStorage.setItem(getTimingEventName(eventName), +new Date());
};

export const stopAnalyticsTiming = (eventName, eventData) => {
  const event = getTimingEventName(eventName);
  const startEventTime = timingsStorage.getItem(event);
  let duration = null;

  if (startEventTime) {
    duration = +new Date() - startEventTime;
    timingsStorage.setItem(`KF_GA_TIMING_${sanitizeName(eventName)}`, duration);
  }

  if (eventData && duration) {
    trackTiming(merge({ value: duration }, eventData));
    clearAnalyticsTiming(eventName);
  }

  return duration;
};

export const clearAnalyticsTiming = (timingEvent) => {
  timingsStorage.removeItem(getTimingEventName(timingEvent));
  timingsStorage.removeItem('KF_GA_TIMING_' + sanitizeName(timingEvent));
};

export const trackTiming = async (eventData) => {
  setUserDimensions();
  ReactGA.timing(
    merge(
      {
        category: null,
        variable: null,
        value: 0, // in milliseconds
        label: null,
      },
      eventData,
    ),
  );
};

export const trackPageView = (page, options = {}) => {
  setUserDimensions(
    GAState.userId,
    GAState.userRoles ? GAState.userRoles[0] : null,
    GAState.groups,
  );
  ReactGA.set({
    page,
    ...options,
  });
  if (page.includes('sqon')) {
    let urlParams = new URLSearchParams(window.location.search);

    sessionStorage.setItem('lastSqon', JSON.stringify(decodeURIComponent(urlParams.get('sqon'))));
  }
  if (
    !page.includes('/search/file') &&
    (timingsStorage.getItem(getTimingEventName(TRACKING_EVENTS.timings.queryToDownload)) ||
      timingsStorage.getItem(getTimingEventName(TRACKING_EVENTS.timings.queryToCavatica))) &&
    !localStorage.getItem('KF_GA_QUERY_SAVED')
  ) {
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.fileRepo.all,
      action: `${TRACKING_EVENTS.actions.query.abandon}: Navigated to "${page}"`,
      label: window.sessionStorage.getItem('lastSqon'),
      value: 2,
    });
  }
  if (!page.includes('/search/file')) {
    clearAnalyticsTiming(TRACKING_EVENTS.timings.queryToDownload);
    clearAnalyticsTiming(TRACKING_EVENTS.timings.queryToCavatica);
    localStorage.removeItem('KF_GA_QUERY_SAVED');
  }
};

export const trackExternalLink = (url) => {
  if (url) ReactGA.outboundLink({ label: url }, () => {});
};

export const trackProfileInteraction = ({ action, value, type }) =>
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.user.profile,
    action: `${type || ''} Edit: ${value ? `open` : `close`}`,
    label: action,
  });

// track page views
history.listen(({ pathname, search, hash }) => trackPageView(pathname + hash + search));
