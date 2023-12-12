import {
  FENCE_AUHTENTIFICATION_STATUS,
  IAuthorizedStudy,
} from '@ferlab/ui/core/components/AuthorizedStudies';
import { IFence } from '@ferlab/ui/core/components/AuthorizedStudies';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { FENCE_NAMES } from 'common/fenceTypes';
import { FenceApi } from 'services/api/fence';
import { RootState } from 'store/types';
import { handleThunkApiReponse } from 'store/utils';

import { IAuthorizedStudiesFetchParams } from './types';

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

export const fetchAuthorizedStudies = createAsyncThunk<
  { studies: IAuthorizedStudy[] },
  IFence[],
  { state: RootState }
>('authorized-studies', async (fences, thunkAPI) => {
  const params: IAuthorizedStudiesFetchParams = {};
  for (const [, fence] of Object.entries(fences)) {
    params[fence.id as keyof IFence] = {
      acl: fence.acl ?? [],
    };
  }
  const { data, error: httpError } = await FenceApi.fetchAuthorizedStudies(params);

  let error = false;
  let studies: IAuthorizedStudy[] = [];
  if (data) {
    for (const [, value] of Object.entries(data)) {
      if (value.error) {
        error = true;
        break;
      }

      studies = [...studies, ...value.data];
    }

    if (error) {
      studies = [];
    }
  }

  return handleThunkApiReponse({
    error: httpError,
    data: {
      studies,
      error,
    },
    reject: thunkAPI.rejectWithValue,
  });
});

export const fetchFenceAuthentificationStatus = createAsyncThunk<
  {
    status: FENCE_AUHTENTIFICATION_STATUS;
    acl: string[];
  },
  FENCE_NAMES,
  { state: RootState }
>('fence/check/auth/status', async (fence, thunkAPI) => {
  const { data, error } = await FenceApi.isAuthenticated(fence);

  let acl: string[] = [];
  if (data?.authenticated) {
    const { data } = await FenceApi.fetchAcls(fence);
    acl = data?.acl || [];
  }

  return handleThunkApiReponse({
    error,
    data: {
      status: data?.authenticated
        ? FENCE_AUHTENTIFICATION_STATUS.connected
        : FENCE_AUHTENTIFICATION_STATUS.disconnected,
      acl,
    },
    reject: thunkAPI.rejectWithValue,
  });
});

export const fenceOpenAuhentificationTab = createAsyncThunk<
  {
    status: FENCE_AUHTENTIFICATION_STATUS;
    acl: string[];
  },
  FENCE_NAMES,
  {
    state: RootState;
  }
>('fence/connection', async (fence, thunkAPI) => {
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
        const { data } = await FenceApi.isAuthenticated(fence);

        if (data?.authenticated) {
          clearInterval(interval);

          let acl: string[] = [];
          if (data?.authenticated) {
            const { data: aclData } = await FenceApi.fetchAcls(fence);
            acl = aclData?.acl || [];
          }

          resolve({
            status: data?.authenticated
              ? FENCE_AUHTENTIFICATION_STATUS.connected
              : FENCE_AUHTENTIFICATION_STATUS.disconnected,
            acl,
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
});

export const fenceDisconnection = createAsyncThunk<any, FENCE_NAMES>(
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
