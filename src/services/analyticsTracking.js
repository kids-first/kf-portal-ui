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
  userId: null,
  userRoles: null,
  clientId: null,
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
    save: 'Save',
    filter: 'Filter',
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

const setUserDimensions = (userId, role) => {
  ReactGA.set({ clientId: GAState.clientId });
  if (userId || GAState.userId) {
    ReactGA.set({ userId: userId || GAState.userId });
    // GA Custom Dimension:index 1: userId (egoId)
    ReactGA.set({ dimension1: userId || GAState.userId });
  }
  if (role || GAState.userRoles) {
    // GA Custom Dimension:index 2: userRole (current selected profile role)
    // ReactGA.set({ userRole: role || GAState.userRoles[0] });
    ReactGA.set({ dimension2: role || GAState.userRoles[0] });
  }
};

export const addStateInfo = obj => merge(GAState, obj);

export const getUserAnalyticsState = () => GAState;

export const trackUserSession = async ({ egoId, _id, acceptedTerms, roles }) => {
  let userId = egoId;
  if (acceptedTerms && !GAState.userId) {
    addStateInfo({ userId, personaId: _id, userRoles: roles });
    setUserDimensions(userId, roles[0]);
    return true;
  } else {
    return false;
  }
};

export const trackUserInteraction = async ({ category, action, label }) => {
  setUserDimensions();
  ReactGA.event({ category, action, ...(label && { label }) });
  switch (category) {
    case TRACKING_EVENTS.categories.modals:
      if (action === TRACKING_EVENTS.actions.open) {
        debugger;
        startAnalyticsTiming(`MODAL__${label}`);
      } else if (action === TRACKING_EVENTS.actions.close) {
        debugger;
        stopAnalyticsTiming(`MODAL__${label}`, {
          category,
          variable: 'open duration',
          ...(label && { label }),
        });
      }

      break;
    case TRACKING_EVENTS.categories.join:
      if (action === TRACKING_EVENTS.actions.signedUp) {
        stopAnalyticsTiming(TRACKING_EVENTS.labels.joinProcess, {
          category,
          variable: 'Join process completion time',
          ...(label && { label }),
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
  }

  return duration;
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
