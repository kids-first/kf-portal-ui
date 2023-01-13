import { RootState } from 'store/types';
import { initialState } from 'store/remote/types';

export type TRemoteProps = initialState;

export const remoteSelector = (state: RootState) => state.remote;
