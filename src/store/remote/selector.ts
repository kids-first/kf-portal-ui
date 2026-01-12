import { initialState } from 'store/remote/types';
import { RootState } from 'store/types';

export type TRemoteProps = initialState;

export const remoteSelector = (state: RootState) => state.remote;
