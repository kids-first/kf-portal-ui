import { IRemoteComponent } from '@ferlab/ui/core/data/sqon/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, RemoteComponentList } from './types';

export const RemoteState: initialState = {
  [RemoteComponentList.MondoTree]: {
    visible: false,
  },
  [RemoteComponentList.HPOTree]: {
    visible: false,
  },
};

const remoteSlice = createSlice({
  name: 'remote',
  initialState: RemoteState,
  reducers: {
    openRemoteComponent: (state, action: PayloadAction<IRemoteComponent>) => ({
      ...state,
      [action.payload.id]: { ...action.payload.props },
    }),
  },
});

export const remoteSliceActions = remoteSlice.actions;
export default remoteSlice.reducer;
