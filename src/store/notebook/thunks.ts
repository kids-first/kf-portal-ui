import intl from 'react-intl-universal';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotebookApi } from 'services/api/notebook';
import { TNotebookApiResponse } from 'services/api/notebook/model';
import { RootState } from 'store/types';
import { handleThunkApiReponse } from 'store/utils';

import { globalActions } from '../global';

const getNotebookClusterManifest = createAsyncThunk<
  TNotebookApiResponse,
  void,
  { rejectValue: string; state: RootState }
>('notebook/manifest', async (args, thunkAPI) => {
  const { data, error } = await NotebookApi.getManifest();

  let errorMessage = '';
  let errorDescription = '';
  if (error) {
    const msg = error.response?.data?.error ?? '';
    if (msg === 'no_fence_connection') {
      errorMessage = 'screen.dashboard.cards.notebook.error.no_fence_connection.message';
      errorDescription = 'screen.dashboard.cards.notebook.error.no_fence_connection.description';
    } else if (msg === 'no_acl') {
      errorMessage = 'screen.dashboard.cards.notebook.error.no_acl.message';
      errorDescription = 'screen.dashboard.cards.notebook.error.no_acl.description';
    } else if (msg === 'no_file_for_acls') {
      errorMessage = 'screen.dashboard.cards.notebook.error.no_file_for_acls.message';
      errorDescription = 'screen.dashboard.cards.notebook.error.no_file_for_acls.description';
    }
  }

  return handleThunkApiReponse({
    error,
    onError: () => {
      if (errorMessage && errorDescription) {
        thunkAPI.dispatch(
          globalActions.displayNotification({
            type: 'error',
            message: intl.get('screen.dashboard.cards.notebook.error.title'),
            description: intl.get(errorDescription),
          }),
        );
      }
    },
    data: data!,
    reject: thunkAPI.rejectWithValue,
  });
});

export { getNotebookClusterManifest };
