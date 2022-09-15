import { FENCE_CONNECTION_STATUSES } from 'common/fenceTypes';

export const hasOneFenceConnected = (fences: any) => {
  Object.keys(fences).forEach((key) => {
    if (fences[key] === FENCE_CONNECTION_STATUSES.connected) {
      return true;
    }
  });

  return false;
};
