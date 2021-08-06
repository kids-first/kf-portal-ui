import { RootState } from '../rootState';

export const selectIsConnected = (state: RootState) => state.cavatica.isConnected;
export const selectConnectionStatus = (state: RootState) => state.cavatica.status;
export const selectIsCheckingStatus = (state: RootState) => state.cavatica.isConnecting;
