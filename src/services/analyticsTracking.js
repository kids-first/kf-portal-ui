import ReactGA from 'react-ga';
import { gaTrackingID, devDebug } from 'common/injectGlobals';
import { addInfo as addUserSnapInfo } from './usersnap';
import history from './history';
import { merge } from 'lodash';

const devTrackingID = localStorage.getItem('DEV_GA_TRACKING_ID');
if (devDebug && devTrackingID) {
  console.warn('warning: using GA Tracking ID override');
}
let GAState = {
  trackingId: devDebug || devTrackingID ? devTrackingID || gaTrackingID : gaTrackingID,
  userId: null, //int
  userRoles: null, //string
  clientId: null, //string
  egoGroups: null, // array?
};
let timingsStorage = window.localStorage;

export const TRACKING_EVENTS = {
  categories: {
    join: 'Join',
    signIn: 'Sign In',
    modals: 'Modals',
    user: {
      profile: 'User Profile',
    },
    fileRepo: {
      filters: 'File Repo: Filters',
      dataTable: 'File Repo: Data Table',
      actionsSidebar: 'File Repo: Actions Sidebar',
    },
  },
  actions: {
    acceptedTerms: 'Accepted Terms',
    signedUp: 'Join Completed!',
    completedProfile: 'Completed Profile',
    open: 'Open',
    close: 'Close',
    click: 'Clicked',
    edit: 'Edit',
    scroll: 'Scrolled',
    save: 'Save',
    filter: 'Filter',
    copy: {
      toCavatica: 'Copied Files to Cavatica Project',
    },
    download: {
      manifest: 'Download Manifest',
      report: 'Download Report',
    },
    query: {
      save: 'Query Saved',
      share: 'Query Shared',
      clear: 'Clear Query (sqon)',
    },
    userRoleSelected: 'User Role Updated',
    integration: {
      connected: 'Integration Connection SUCCESS',
      failed: 'Integration Connection FAILED',
    },
  },
  labels: {
    joinProcess: 'Join Process',
  },
  timings: {
    modal: 'MODAL__',
    queryToDownload: 'FILE_QUERY_TO_DOWNLOAD',
    queryToCavatica: 'FILE_QUERY_TO_CAVATICA_COPY',
  },
};

export const initAnalyticsTracking = () => {
  ReactGA.initialize(GAState.trackingId, { debug: devDebug });
  ReactGA.ga(function(tracker) {
    var clientId = tracker.get('clientId');
    addStateInfo({ clientId });
    addUserSnapInfo({ gaClientId: clientId });

    // GA Custom Dimension:index 3: clientId
    // ReactGA.set({ clientId: GAState.clientId });
    ReactGA.set({ dimension3: GAState.clientId });
  });
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

  if ((groups && groups.length) || (GAState.egoGroups && GAState.egoGroups.length)) {
    let _groups = JSON.stringify({ egoGroups: groups || GAState.egoGroups });
    // GA Custom Dimension:index 4: egoGroup (pulled from ego jwt)
    // ReactGA.set({ egoGroup: role || GAState.userRoles[0] });
    ReactGA.set({ dimension4: _groups });
  }
};

export const addStateInfo = obj => merge(GAState, obj);

export const getUserAnalyticsState = () => GAState;

export const trackUserSession = async ({ egoId, _id, acceptedTerms, roles, egoGroups }) => {
  let userId = egoId;
  if (acceptedTerms && !GAState.userId) {
    addStateInfo({ userId, personaId: _id, userRoles: roles, egoGroups });
    setUserDimensions(userId, roles[0], egoGroups);
    return true;
  } else {
    return false;
  }
};

export const trackUserInteraction = async ({ category, action, label }) => {
  setUserDimensions();
  ReactGA.event({ category, action, label });
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
    case TRACKING_EVENTS.categories.fileRepo.filters:
      let downloadEventStarted = timingsStorage.getItem(getTimingEventName('FILE_DOWNLOAD'));
      if (action === 'Filter Selected' && !downloadEventStarted) {
        startAnalyticsTiming(TRACKING_EVENTS.timings.queryToDownload);
        startAnalyticsTiming('FILE_QUERY_TO_CAVATICA_COPY');
      }
      break;
    case TRACKING_EVENTS.categories.fileRepo.actionsSidebar:
      if (
        TRACKING_EVENTS.actions.download.report ||
        'Download Manifest ' + TRACKING_EVENTS.actions.click
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
    default:
      break;
  }
};

const sanitizeName = name => name.toUpperCase().replace(/\s/g, '_');
const getTimingEventName = name => `KF_GA_TIMING_INIT_${sanitizeName(name)}`;

export const startAnalyticsTiming = eventName => {
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

export const clearAnalyticsTiming = timingEvent => {
  timingsStorage.removeItem(getTimingEventName(timingEvent));
  timingsStorage.removeItem('KF_GA_TIMING_' + sanitizeName(timingEvent));
};

export const trackTiming = async eventData => {
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
  setUserDimensions();
  ReactGA.set({
    page,
    ...options,
  });
  ReactGA.pageview(page);
  if (!page.includes('/search/file')) {
    clearAnalyticsTiming(TRACKING_EVENTS.timings.queryToDownload);
    clearAnalyticsTiming(TRACKING_EVENTS.timings.queryToCavatica);
  }
};

export const trackExternalLink = url => {
  ReactGA.outboundLink({ label: url }, () => {});
};

export const trackProfileInteraction = ({ action, value, type }) =>
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.user.profile,
    action: `${type || ''} Edit: ${value ? `open` : `close`}`,
    label: action,
  });

// track page views
history.listen(({ pathname, search, hash }, action) => trackPageView(pathname + hash + search));
