import { createAsyncThunk } from '@reduxjs/toolkit';

import { PersonaApi, TPersonaUserRequestPayload } from 'services/api/persona';
import { IPersonaUser, TPersonaUserUpdate } from 'services/api/persona/models';
import { RootState } from 'store/types';
import { handleThunkApiReponse } from 'store/utils';

const createPersonaUser = createAsyncThunk<
  IPersonaUser,
  IPersonaUser,
  { rejectValue: string; state: RootState }
>(
  'persona/create',
  async (payload, thunkAPI) => {
    const { data: newPersonaUser, error } = await PersonaApi.create(payload);

    if (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }

    if (newPersonaUser) {
      await PersonaApi.subscribe(newPersonaUser.data.userCreate?.record);
    }

    return handleThunkApiReponse({
      error,
      data: newPersonaUser?.data.userCreate?.record!,
      reject: thunkAPI.rejectWithValue,
    });
  },
  {
    condition: (_, { getState }) => {
      const { persona } = getState();
      if (persona.profile) {
        return false;
      }
    },
  },
);

const fetchPersonaUser = createAsyncThunk<
  IPersonaUser,
  TPersonaUserRequestPayload,
  { rejectValue: string; state: RootState }
>(
  'persona/fetch',
  async (_, thunkAPI) => {
    const { data, error } = await PersonaApi.fetch();

    if (!error) {
      return data?.data?.self!;
    }

    return thunkAPI.rejectWithValue(error?.message);
  },
  {
    condition: (_, { getState }) => {
      const { persona } = getState();
      if (persona.personaUserInfo) {
        return false;
      }
    },
  },
);

const fetchPersonaUserProfile = createAsyncThunk<
  IPersonaUser,
  {
    id: string;
  },
  { rejectValue: string; state: RootState }
>('persona/fetch/profile', async (args, thunkAPI) => {
  const { data, error } = await PersonaApi.fetchProfile(args.id);

  if (!error) {
    return data?.data?.user!;
  }

  return thunkAPI.rejectWithValue(error?.message);
});

const updatePersonaUser = createAsyncThunk<
  IPersonaUser,
  {
    data: TPersonaUserUpdate;
    callback?: () => void;
  },
  { rejectValue: string }
>(
  'persona/update',
  async (args, thunkAPI) => {
    const { data, error } = await PersonaApi.update(args.data);
    return handleThunkApiReponse({
      error,
      data: data?.data?.userUpdate?.record!,
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

export { createPersonaUser, fetchPersonaUser, fetchPersonaUserProfile, updatePersonaUser };
