import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'store/types';
import { ALL_FENCE_NAMES, FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { handleThunkApiReponse } from 'store/utils';
import { FenceApi } from 'services/api/fence';
import { IFenceAuthPayload, IFenceInfo } from 'services/api/fence/models';

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

/* NEW NEW NEW */

const checkFencesAuthStatus = createAsyncThunk<void, void, { state: RootState }>(
  'fence/checkAll/auth/status',
  async (_, thunkAPI) => {
    ALL_FENCE_NAMES.forEach(async (fence) => await thunkAPI.dispatch(checkFenceAuthStatus(fence)));
  },
);

const checkFenceAuthStatus = createAsyncThunk<
  {
    auth: IFenceAuthPayload;
    acls: string[];
  },
  FENCE_NAMES,
  { state: RootState }
>(
  'fence/check/auth/status',
  async (fence, thunkAPI) => {
    let fenceAcls: string[] = [];
    const { data, error } = await FenceApi.isAuthenticated(fence);

    if (data?.authenticated) {
      const { data: aclData } = await FenceApi.fetchAcls(fence);
      fenceAcls = aclData?.acl || [];
    }

    return handleThunkApiReponse({
      error,
      data: {
        auth: data!,
        acls: fenceAcls,
      },
      reject: thunkAPI.rejectWithValue,
    });
  },
  {
    condition: (fence, { getState }) => {
      const { fenceConnection } = getState();

      return (
        !fenceConnection.loadingFences.includes(fence) &&
        fenceConnection.connectionStatus[fence] === FENCE_CONNECTION_STATUSES.unknown
      );
    },
  },
);

const connectToFence = createAsyncThunk<
  {
    info: IFenceInfo;
    acls: string[];
  },
  FENCE_NAMES,
  {
    state: RootState;
  }
>(
  'fence/connection',
  async (fence, thunkAPI) => {
    const { fenceConnection } = thunkAPI.getState();
    let fenceInfo = fenceConnection.fencesInfo[fence];

    if (!fenceInfo) {
      const { data } = await FenceApi.fetchInfo(fence);
      fenceInfo = data;
    }

    const authWindow = window.open(fenceInfo?.authorize_uri)!;

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        if (authWindow.closed) {
          let fenceAcls: string[] = [];
          const { data } = await FenceApi.isAuthenticated(fence);

          if (data?.authenticated) {
            clearInterval(interval);

            if (data?.authenticated) {
              const { data: aclData } = await FenceApi.fetchAcls(fence);
              fenceAcls = aclData?.acl || [];
            }

            resolve({
              info: fenceInfo!,
              acls: fenceAcls,
            });
          } else {
            clearInterval(interval);
            reject('failed authenticating');
          }
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        reject('nothing');
      }, TEN_MINUTES_IN_MS);
    });
  },
  {
    condition: (fence, { getState }) =>
      [FENCE_CONNECTION_STATUSES.unknown, FENCE_CONNECTION_STATUSES.disconnected].includes(
        getState().fenceConnection.connectionStatus[fence],
      ),
  },
);

const disconnectFromFence = createAsyncThunk<any, FENCE_NAMES>(
  'fence/disconnection',
  async (fence, thunkAPI) => {
    const { data, error } = await FenceApi.disconnect(fence);

    return handleThunkApiReponse({
      error,
      data,
      reject: thunkAPI.rejectWithValue,
    });
  },
);

export { connectToFence, disconnectFromFence, checkFenceAuthStatus, checkFencesAuthStatus };
