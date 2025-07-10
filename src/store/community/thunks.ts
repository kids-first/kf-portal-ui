import { createAsyncThunk } from '@reduxjs/toolkit';

import { ISearchParams, UserApi } from '../../services/api/user';
import { TUser } from '../../services/api/user/models';
import { handleThunkApiReponse } from '../utils';

const fetchCommunityUsers = createAsyncThunk<
  { users: TUser[]; total: number; allActiveUsersTotal: number },
  ISearchParams,
  { rejectValue: string }
>('users/fetch', async (query, thunkAPI) => {
  const { data, error } = await UserApi.search(query);
  return handleThunkApiReponse({
    error,
    data: data!,
    reject: thunkAPI.rejectWithValue,
  });
});

export { fetchCommunityUsers };
