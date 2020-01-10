import { initGATracking } from './googleAnalytics';
import { HJTrigger } from './hotjarTracking';

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
export const analyticsTrigger = HJTrigger;

export const initAnalyticsTracking = () => {
  initGATracking();
};
