import { createAsyncThunk } from '@reduxjs/toolkit';

import { UserApi } from 'services/api/user';
import { TUser, TUserConfig, TUserUpdate } from 'services/api/user/models';
import { globalActions } from 'store/global';
import { RootState } from 'store/types';
import { handleThunkApiReponse } from 'store/utils';
import { mergeDeep } from 'utils/object';

import { userActions } from './slice';
import { TColumnStates } from '@ferlab/ui/core/components/ProTable/types';
import { cloneDeep, get, keys, merge, set } from 'lodash';

const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string; state: RootState }>(
  'user/fetch',
  async (_, thunkAPI) => {
    const { data, error } = await UserApi.fetch();

    if (!error) {
      return data!;
    }

    if (error?.response?.status === 404) {
      const { data: newUser, error: newUserError } = await UserApi.create();

      return handleThunkApiReponse({
        error: newUserError,
        data: newUser!,
        reject: thunkAPI.rejectWithValue,
      });
    } else {
      return thunkAPI.rejectWithValue(error?.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { user } = getState();
      if (user.userInfo) {
        return false;
      }
    },
  },
);

const updateUser = createAsyncThunk<
  TUser,
  {
    data: TUserUpdate;
    callback?: () => void;
  },
  { rejectValue: string }
>(
  'user/update',
  async (args, thunkAPI) => {
    const { data, error } = await UserApi.update(args.data);

    return handleThunkApiReponse({
      error,
      data: data!,
      reject: thunkAPI.rejectWithValue,
      onSuccess: args.callback,
    });
  },
  {
    condition: (args) => {
      if (Object.keys(args.data).length < 1) {
        return false;
      }
    },
  },
);

const cleanupConfig = (config: TUserConfig): TUserConfig => {
  // keep last item
  const removeDuplicates = (cols: TColumnStates) =>
    cols.filter((c, i) => !cols.some((other, j) => c.key === other.key && j > i));

  // for every tables in config replace columns with no duplicates
  keys(config.data_exploration?.tables).forEach((key) => {
    const path = 'data_exploration.tables.' + key + '.columns';
    const cols = get(config, path, []);
    set(config, path, removeDuplicates(cols));
  });

  return config;
};

const updateUserConfig = createAsyncThunk<TUserConfig, TUserConfig, { state: RootState }>(
  'user/updateConfig',
  async (config, thunkAPI) => {
    const state = thunkAPI.getState();
    const mergedConfig = cleanupConfig(
      merge(cloneDeep(state?.user?.userInfo?.config), cloneDeep(config)),
    );
    await UserApi.update({ config: mergedConfig });

    return mergedConfig;
  },
  {
    condition: (config) => Object.keys(config).length > 0,
  },
);

const deleteUser = createAsyncThunk<void, void, { rejectValue: string; state: RootState }>(
  'user/delete/user',
  async (_, thunkAPI) => {
    const { error } = await UserApi.deleteUser();

    return handleThunkApiReponse({
      error: error,
      data: undefined,
      reject: thunkAPI.rejectWithValue,
      onSuccess: () => thunkAPI.dispatch(userActions.cleanLogout()),
      onError: (_) =>
        thunkAPI.dispatch(
          globalActions.displayNotification({
            type: 'error',
            message: 'Error',
            description: 'Unable to delete your account at the moment',
          }),
        ),
    });
  },
);

export { fetchUser, updateUser, updateUserConfig, deleteUser };
