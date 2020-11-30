import { initGATracking } from './googleAnalytics';
import { initUserSnap } from './usersnap';

export { TRACKING_EVENTS } from './trackingEventConstants';
export {
  trackUserInteraction,
  trackUserSession,
  trackPageView,
  setUserDimension,
  trackProfileInteraction,
  addStateInfo as updateTrackingDimension,
  addStateInfo,
  trackExternalLink,
  startAnalyticsTiming,
} from './googleAnalytics';

export const initAnalyticsTracking = () => {
  initGATracking();
  initUserSnap();
};
