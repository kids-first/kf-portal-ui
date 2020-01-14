import { ENABLE_FEATURE } from '../actionTypes';

export const enableFeature = feature => ({
  type: ENABLE_FEATURE,
  payload: feature,
});