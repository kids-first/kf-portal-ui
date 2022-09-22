import { FENCE_CONNECTION_STATUSES } from 'common/fenceTypes';
import { TFencesConnectionStatus } from 'store/fenceConnection/types';

export const hasOneFenceConnected = (fences: TFencesConnectionStatus) =>
  Object.values(fences).some((fence) => fence === FENCE_CONNECTION_STATUSES.connected);
