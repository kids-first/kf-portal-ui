import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/persona/types';
import {
  createPersonaUser,
  fetchPersonaUser,
  fetchPersonaUserProfile,
  updatePersonaUser,
} from 'store/persona/thunks';
import { IPersonaUser } from 'services/api/persona/models';

// Since api can return null for personaUserInfo, undefined must be set by default
export const PersonaState: initialState = {
  personaUserInfo: undefined,
  profile: undefined,
  isLoading: true,
  isUpdating: false,
  isDeleting: false,
};

const personaSlice = createSlice({
  name: 'persona',
  initialState: PersonaState,
  reducers: {
    cleanLogout: (state) => {
      state.profile = undefined;
      state.personaUserInfo = PersonaState.personaUserInfo;
      state.isLoading = PersonaState.isLoading;
      state.isUpdating = PersonaState.isUpdating;
      state.isDeleting = PersonaState.isDeleting;
    },
    setIsPersonaLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
    setUserAsMember: (state, action: PayloadAction<IPersonaUser>) => ({
      ...state,
      isLoading: false,
      profile: action.payload,
    }),
    clearProfile: (state) => {
      state.profile = undefined;
    },
  },
  extraReducers: (builder) => {
    // Create Persona User
    builder.addCase(createPersonaUser.pending, (state) => ({
      ...state,
      isLoading: true,
      error: undefined,
    }));
    builder.addCase(createPersonaUser.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      personaUserInfo: action.payload,
    }));
    builder.addCase(createPersonaUser.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }));
    // Fetch Persona User
    builder.addCase(fetchPersonaUser.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchPersonaUser.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      personaUserInfo: action.payload,
    }));
    builder.addCase(fetchPersonaUser.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }));
    // Update Persona User
    builder.addCase(updatePersonaUser.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      personaUserInfo: { ...state.personaUserInfo, ...action.payload },
    }));
    // Fetch Profile
    builder.addCase(fetchPersonaUserProfile.pending, (state) => {
      state.isLoading = true;
      state.profile = undefined;
      state.error = undefined;
    });
    builder.addCase(fetchPersonaUserProfile.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      profile: action.payload,
    }));
    builder.addCase(fetchPersonaUserProfile.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      profile: undefined,
      isLoading: false,
    }));
  },
});

export const personaActions = personaSlice.actions;
export default personaSlice.reducer;
