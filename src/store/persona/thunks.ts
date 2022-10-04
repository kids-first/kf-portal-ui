import { createAsyncThunk } from '@reduxjs/toolkit';
import { PersonaApi, TPersonaUserRequestPayload } from 'services/api/persona';
import { RootState } from 'store/types';
import { handleThunkApiReponse } from 'store/utils';
import { TPersonaUser, TPersonaUserUpdate } from 'services/api/persona/models';

const createPersonaUser = createAsyncThunk<
  TPersonaUser,
  TPersonaUser,
  { rejectValue: string; state: RootState }
>(
  'persona/create',
  async (payload, thunkAPI) => {
    const { data: newPersonaUser, error } = await PersonaApi.create(payload);

    if (error) {
      return thunkAPI.rejectWithValue(error?.message);
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
  TPersonaUser,
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
  TPersonaUser,
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
  TPersonaUser,
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
