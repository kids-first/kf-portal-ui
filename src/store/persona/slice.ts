import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/persona/types';
import { createPersonaUser, fetchPersonaUser } from 'store/persona/thunks';

// Since api can return null for personaUserInfo, undefined must be set by default
export const PersonaState: initialState = {
  personaUserInfo: undefined,
  isLoading: true,
  isUpdating: false,
  isDeleting: false,
};

const personaSlice = createSlice({
  name: 'persona',
  initialState: PersonaState,
  reducers: {
    cleanLogout: (_) => PersonaState,
    setIsPersonaLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
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
  },
});

export const personaActions = personaSlice.actions;
export default personaSlice.reducer;
