import intl from 'react-intl-universal';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { SavedSetApi } from 'services/api/savedSet';
import {
  IUserSetOutput,
  SetType,
  TBiospecimenRequest,
  TUserSavedSetInsert,
  TUserSavedSetUpdate,
} from 'services/api/savedSet/models';
import { globalActions } from 'store/global';
import { handleThunkApiReponse } from 'store/utils';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { getSetFieldId } from '.';
import { Modal } from 'antd';
import { SUPPORT_EMAIL } from 'store/report/thunks';

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
          description: isBiospecimenRequest
            ? intl.get('api.biospecimenRequest.error.messageUpdate')
            : intl.get('api.savedSet.error.messageUpdate'),
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

const fetchSharedBiospecimenRequest = createAsyncThunk<
  TBiospecimenRequest | undefined,
  string,
  { rejectValue: string }
>('shared/savedsets/fetch', async (id, thunkAPI) => {
  const { data, error } = await SavedSetApi.getSharedById(id);

  if (data) {
    const setValue = `${SET_ID_PREFIX}${data.id}`;
    addQuery({
      queryBuilderId: DATA_EXPLORATION_QB_ID,
      query: generateQuery({
        newFilters: [
          generateValueFilter({
            field: getSetFieldId(SetType.BIOSPECIMEN_REQUEST),
            value: [setValue],
            index: SetType.BIOSPECIMEN,
            overrideValuesName: data.alias,
          }),
        ],
      }),
      setAsActive: true,
    });
  }

  return handleThunkApiReponse({
    error,
    onError: () =>
      Modal.error({
        content: intl.getHTML('global.errors.query.notFound.content', {
          href: `mailto:${SUPPORT_EMAIL}`,
        }),
        okText: intl.get('global.errors.query.notFound.okText'),
        title: intl.get('global.errors.query.notFound.title'),
      }),
    data: data,
    reject: thunkAPI.rejectWithValue,
  });
});

export {
  fetchSavedSet,
  createSavedSet,
  updateSavedSet,
  deleteSavedSet,
  fetchSharedBiospecimenRequest,
};
