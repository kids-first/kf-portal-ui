import intl from 'react-intl-universal';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { SavedSetApi } from 'services/api/savedSet';
import {
  IUserSetOutput,
  SetType,
  TUserSavedSetInsert,
  TUserSavedSetUpdate,
} from 'services/api/savedSet/models';
import { globalActions } from 'store/global';
import { handleThunkApiReponse } from 'store/utils';

const fetchSavedSet = createAsyncThunk<IUserSetOutput[], void | string, { rejectValue: string }>(
  'savedsets/fetch',
  async (tag, thunkAPI) => {
    const { data, error } = await SavedSetApi.fetchAll();

    return handleThunkApiReponse({
      error,
      data: data || [],
      reject: thunkAPI.rejectWithValue,
    });
  },
);

const createSavedSet = createAsyncThunk<
  IUserSetOutput,
  TUserSavedSetInsert & { onCompleteCb: () => void },
  { rejectValue: string }
>('savedsets/create', async (set, thunkAPI) => {
  const { data, error } = await SavedSetApi.create(set);
  set.onCompleteCb();

  return handleThunkApiReponse({
    error,
    data: data!,
    reject: thunkAPI.rejectWithValue,
    onSuccess: () =>
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'success',
          message: intl.get('api.savedSet.success.titleCreate'),
          description:
            set.type === SetType.VARIANT
              ? intl.get('api.savedSet.success.messageCreateVariant')
              : intl.get('api.savedSet.success.messageCreate'),
        }),
      ),
    onError: (_) =>
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'error',
          message: intl.get('api.savedSet.error.title'),
          description: intl.get('api.savedSet.error.messageCreate'),
        }),
      ),
  });
});

const updateSavedSet = createAsyncThunk<
  IUserSetOutput,
  TUserSavedSetUpdate & { id: string; onCompleteCb: () => void; isBiospecimenRequest?: boolean },
  { rejectValue: string }
>('savedsets/update', async (set, thunkAPI) => {
  const { id, isBiospecimenRequest, ...setInfo } = set;
  const { data, error } = await SavedSetApi.update(id, setInfo);

  set.onCompleteCb();

  return handleThunkApiReponse({
    error,
    data: data!,
    reject: thunkAPI.rejectWithValue,
    onError: (error) =>
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'error',
          message: intl.get('api.savedFilter.error.title'),
          description: intl.get('api.savedFilter.error.messageUpdate'),
        }),
      ),
    onSuccess: () =>
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'success',
          message: intl.get('api.savedSet.success.titleUpdate'),
          description: isBiospecimenRequest
            ? intl.get('api.biospecimenRequest.success.messageUpdate')
            : intl.get('api.savedSet.success.messageUpdate'),
        }),
      ),
  });
});

const deleteSavedSet = createAsyncThunk<string, string, { rejectValue: string }>(
  'savedsets/delete',
  async (id, thunkAPI) => {
    const { data, error } = await SavedSetApi.destroy(id);

    return handleThunkApiReponse({
      error,
      data: data!,
      reject: thunkAPI.rejectWithValue,
      onError: () =>
        thunkAPI.dispatch(
          globalActions.displayNotification({
            type: 'error',
            message: intl.get('api.savedFilter.error.title'),
            description: intl.get('api.savedFilter.error.messageDelete'),
          }),
        ),
    });
  },
);

export { fetchSavedSet, createSavedSet, updateSavedSet, deleteSavedSet };
