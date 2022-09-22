import { FENCE_CONNECTION_STATUSES } from 'common/fenceTypes';

export const hasOneFenceConnected = (fences: any) =>
  Object.values(fences).some((fence) => fence === FENCE_CONNECTION_STATUSES.connected);
