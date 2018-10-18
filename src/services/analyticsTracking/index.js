import { initGATracking } from './googleAnalytics';
import { init as initHJTracking } from './hotjarTracking';

export {
  trackUserInteraction,
  trackUserSession,
  trackPageView,
  setUserDimension,
  trackProfileInteraction,
  updateTrackingDimension,
  addStateInfo,
  trackExternalLink,
  startAnalyticsTiming,
} from './googleAnalytics';

export { TRACKING_EVENTS } from './trackingEventConstants';

export const initAnalyticsTracking = () => {
  initGATracking();
  initHJTracking();
};
